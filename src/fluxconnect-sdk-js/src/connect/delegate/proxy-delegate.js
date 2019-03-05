import { ApiExecService } from '../api/api-exec-service';
import { Channel } from '../net/channel';
import { TransportMsg, DEFAULT_TTL_MS, ERROR_TIMEOUT, MsgContext } from './msg';
import promiseTimeout from '../util/promiseTimeout';
import mixins from '../util/mixins';
import { ConnectException } from '../net/exception';
import { ReplyHandler } from './proxy-manager';

const ERROR_LIVELINESS_TIMEOUT = new Error('liveliness timeout');
const ERROR_CLOSE_NOT_AVAILABLE = new Error('close not available');

const DelegateHeadName = 'did';
const NotifyHeadName = 'ntf';

/**
 * total time to wait before triggering timeout ~= ttl * (DefaultTTLMissedMax + 1) + 0.5s * (DefaultTTLMissedMax + 1)
 * default ttl = 2, set on server, can be different depending on delegate
 */
const DefaultTTLMissedMax = 5;

export class ProxyDelegate extends ApiExecService {
  
  pubTarget = '';
  data = null;
  ttl = 0;
  delegateId = '';
  sub = undefined;

  resolveInit = undefined;
  rejectInit = undefined;

  resolveClosed = undefined;

  initTimer = undefined;
  activityTimer = undefined;
  missedCount = 0;
  ttlMissedMax = DefaultTTLMissedMax;

  constructor(replyTo, openMethod, closeMethod) {
    super();
    this.replyTo = replyTo;
    this.openMethod = openMethod || 'open';
    this.closeMethod = closeMethod || 'close';
  }

  createChildProxyDelegate(ProxyMixin, openMethod, closeMethod) {

    let replyTo = `${this.replyTo}:${this.randomUUID()}`;
    let Proxy = mixins(ProxyDelegate, ProxyMixin);
    let d = new Proxy(replyTo, openMethod, closeMethod);
    d.getChannel = this.getChannel;
    d.getServiceDefaultOptions = this.getServiceDefaultOptions;
    d.getDefaultOptions = this.getDefaultOptions;
    d.getEndpointPrefix = function() {return [];};
    d.getEndpoint = () => this.pubTarget;
    d._request = this._request;
    d.randomUUID = this.randomUUID;
    return d;

  }

  init(data, timeout) {

    let pr = new Promise((resolve, reject) => {
      
      this.resolveInit = resolve;
      this.rejectInit = reject;
      
      if (!(timeout > 0)) {
        timeout = DEFAULT_TTL_MS;
      }

      if (timeout > 0) {
        this.initTimeout(reject, timeout);
      }
      
      this._request(Channel.METHOD.SUBSCRIBE, {subject: this.replyTo, callback: this.initCallback.bind(this)}).then(sub => {

        this.sub = sub;

        let params = {
          endpoint: [this.openMethod],
          data: data,
          replyTo: this.replyTo,
          encode: {body: 'raw'},
        };

        return this._request(Channel.METHOD.PUBLISH, params, {timeout: timeout});

      }).catch(err => {
        if (this.sub) {
          this.sub.unsubscribe();
        }
        reject(err);
      });

    });

    return pr;
  }

  initTimeout(reject, timeout) {
    if (this.initTimer !== undefined) {
      clearTimeout(this.initTimer);
    }
    this.initTimer = setTimeout(_ => {
      if (this.sub) {
        this.sub.unsubscribe();
      }
      clearTimeout(this.initTimer);
      this.initTimer = undefined;
      reject(ERROR_TIMEOUT);
    }, timeout);
  }

  /**
   * @param {TransportMsg} msg
   * @param {MsgContext} msg ctx
   */
  initCallback(msg, ctx) {
    
    let head = readHead(msg.head);

    if (head[0] === DelegateHeadName && head[1]) {
      
      console.log('init', msg);

      this.pubTarget = ctx.replyTo;
      if (msg.payload) {
        this.data = msg.payload.body;
      }

      // if (msg.ttl > 0) {
      //   this.ttl = msg.ttl;
      // }

      this.delegateId = head[1];
      
      if (this.initTimer) {
        clearTimeout(this.initTimer);
      }

      if (this.resolveInit) {
        this.resolveInit(this.data);
        this.resolveInit = undefined;
      }

      // handle activity
      this.handleActivity(msg.ttl);

    } else if (head[0] === NotifyHeadName) {
      this.handleNoify(head[1], msg, ctx);
    } else if (msg.closed) {

      console.log('closed', msg);

      this.sub.unsubscribe();
      if (msg.error) {
        this.processError(msg.error);
      }
      this.handleClosed();
    } else if (msg.error) {

      console.log('error', msg);

      if (this.delegateId) {
        // connected
        this.processError(msg.error);
      } else {
        clearTimeout(this.initTimer);
        // waiting init
        // TODO handle msg.errStr
        this.rejectInit(ConnectException.create(msg.payload.statusCode, 'proxy delegate init error', msg.error.body));
      }
    } else if (msg.ttl > 0) {
      if (this.delegateId) {
        // connected
        // reset activity timer
        this.handleActivity(msg.ttl);
      } else {
        // waiting init
        // reset init timer

        if (this.rejectInit !== undefined) {
          this.initTimeout(this.rejectInit, msg.ttl + 500);
        }
      }
      if (msg.Ack) {
        this.ackConfirm(this.pubTarget).catch(e => {
          this.processError(e);
        });
      }
    }
  }


  /**
   * @param {string} confirmTarget
   */
  ackConfirm(confirmTarget) {
    
    let msg = new TransportMsg();
    msg.ctrl = true;
    msg.ackConfirm = true;

    let params = {
      subject: confirmTarget,
      data: msg,
      replyTo: this.replyTo,
    };

    return this._request(Channel.METHOD.PUBLISH, params);
  }

  /**
   * @param {string} method
   * @param {*}      data
   * @param {string} replyTo
   * @param {Number} timeout
   */
  methodCall(method, data, replyTo, timeout) {

    let replyHandler;

    if (!replyTo) {
      replyTo = `${this.replyTo}.${this.randomUUID()}`;
    }

    if (!(timeout > 0)) {
      timeout = DEFAULT_TTL_MS;
    }

    let pr = new Promise((resolve, reject) => {

      replyHandler = new ReplyHandler(resolve, reject, timeout);

      this._request(Channel.METHOD.SUBSCRIBE, {subject: replyTo, callback: replyHandler.callback.bind(replyHandler)}).then(sub => {
        
        replyHandler.sub = sub;

        let params = {
          subject: `${this.pubTarget}.${method}`,
          data: data,
          replyTo: replyTo,
        };

        return this._request(Channel.METHOD.PUBLISH, params, {timeout: timeout});

      }).catch(err => {
        replyHandler.unsubscribe();
        reject(err);
      });

    });

    return pr;
  }

  /**
   * @param {string} method
   * @param {TransportMsg} msg
   * @param {string} replyTo
   */
  _publish(method, msg, replyTo) {
    
    let params = {
      subject: `${this.pubTarget}.${method}`,
      data: msg,
      replyTo: replyTo || '',
    };

    return this._request(Channel.METHOD.PUBLISH, params);
  }

  handleActivity(ttl) {

    if (!ttl) {
      ttl = DEFAULT_TTL_MS;
    }

    if (this.activityTimer !== undefined) {
      clearTimeout(this.activityTimer);
    }

    this.missedCount = 0;

    this.activityTimer = setTimeout(() => {
      
      clearTimeout(this.activityTimer);
      this.activityTimer = undefined;

      this.missedCount++;

      if (this.missedCount <= this.ttlMissedMax) {
        this.handleActivity(ttl);
        return;
      }

      this.sub.unsubscribe();
      this.processError(ERROR_LIVELINESS_TIMEOUT);
      this.handleClosed();

    }, ttl + 500);

  }

  processError(err) {
    this.emit('error', err);
  }

  handleClosed() {
    if (this.activityTimer !== undefined) {
      clearTimeout(this.activityTimer);
    }
    if (this.resolveClosed) {
      this.resolveClosed(true);
      this.resolveClosed = undefined;
    }
    
    this.resolveInit = undefined;
    this.rejectInit = undefined;

    this.emit('closed');
  }

  /**
   * @param {string} typ
   * @param {TransportMsg} msg
   * @param {MsgContext} ctx
   */
  handleNoify(typ, msg, ctx) {

    let ttlFunc = ctx.replyTTL.bind(ctx);
    let notifyReplyFunc = function(data) {

      if (msg.ack) {
        let m = new TransportMsg();
        m.ackConfirm = true;
        return ctx.reply(m);
      }
      
      return ctx.reply(data);
      
    };

    this.emit(`notify.${typ}`, msg.payload ? msg.payload.body : undefined, notifyReplyFunc, ttlFunc);

  }

  /**
   * @param {Number} timeout
   * @returns {Promse<boolean>}
   */
  proxyClose(timeout) {
    
    if (!this.closeMethod) {
      return Promise.reject(ERROR_CLOSE_NOT_AVAILABLE);
    }

    let pr = new Promise((resolve, reject) => {
      
      this.resolveClosed = resolve;
      
      let params = {
        subject: `${this.pubTarget}.${this.closeMethod}`,
        data: null,
        replyTo: '',
      };

      this._request(Channel.METHOD.PUBLISH, params, {timeout: timeout});

    });

    return timeout > 0 ? promiseTimeout(timeout, pr, ERROR_TIMEOUT) : pr;

  }
  

}

ProxyDelegate.Mixin = (ProxyMixin) => {

  let Mixed = mixins(ProxyDelegate, ProxyMixin);
  return new Mixed();

};

function readHead(head) {
  return head ? head.split('/') : ['', ''];
}
