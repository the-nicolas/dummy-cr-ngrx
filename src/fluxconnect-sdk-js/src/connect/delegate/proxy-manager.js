import { ApiExecService } from '../api/api-exec-service';
import { ProxyDelegate } from './proxy-delegate';
import { Channel } from '../net/channel';
import _ from 'lodash';
import { TransportMsg, ApiMsgPayload, DEFAULT_TTL_MS, MsgContext } from './msg';
import mixins from '../util/mixins';
import { ConnectException } from '../net/exception';

const ERROR_TIMEOUT = new Error('timeout');

export class ProxyManager extends ApiExecService {
  
  endpoint;
  replyTo;

  constructor(endpoint, replyTo) {
    super();
    this.endpoint = endpoint;
    this.replyTo = replyTo;
  }

  /**
   * creates proxy delegate
   * @param {string} replyTo
   * @param {string} openMethod
   * @param {string} closeMethod
   * @returns {ProxyDelegate}
   */
  createProxyDelegate(ProxyMixin, replyTo, openMethod, closeMethod) {
    replyTo = `${this.replyTo}.${replyTo}`;
    let Proxy = mixins(ProxyDelegate, ProxyMixin);
    let d = new Proxy(replyTo, openMethod, closeMethod);
    d.getChannel = this.getChannel;
    d.getServiceDefaultOptions = this.getServiceDefaultOptions;
    d.getDefaultOptions = this.getDefaultOptions;
    d.getEndpointPrefix = this.getEndpointPrefix;
    d.getEndpoint = this.getEndpoint;
    d._request = this._request;
    d.randomUUID = this.randomUUID;
    return d;
  }

  getDefaultOptions() {
    return {
      channelConfig: [Channel.NATS],
    };
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
          endpoint: [method],
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
   *
   * @param {string} method Channel.METHOD
   * @param params request parameters
   * @param options request options
   * @returns {Promise}
   */
  _request(method, params, options) {

    if (method !== Channel.METHOD.SUBSCRIBE) {

      let msg = params.data;

      if (!msg || (msg && !_.isFunction(msg.encode))) {
        msg = new TransportMsg();
        msg.ttl = parseInt(options.timeout, 10);
        msg.payload = new ApiMsgPayload(params.data);
      }

      params.data = msg.encode(params.encode);

    }

    if (!params.subject && params.endpoint) {
      params.subject = this.getEndpointPrefix().concat(this.getEndpoint()).concat(params.endpoint).join('.');
    }

    if (_.isFunction(params.callback)) {
      
      let cb = params.callback;
      let replyFunc = this._request.bind(this);
      params.callback = function(msg, replyTo, subj, sid) {
        
        let m = TransportMsg.decodeWithPayload(msg, params.payloadClass);

        let ctx = new MsgContext();
        ctx.replyTo = replyTo;
        ctx.subject = subj;
        ctx.ttl = m.ttl;

        ctx.replyFunc = function(data, replyFrom) {
          return replyFunc(Channel.METHOD.PUBLISH, {subject: replyTo, replyTo: replyFrom, data: data}, {timeout: 0});
        };
        
        cb(m, ctx, sid);
        // setImmediate(function() {
          
        // });
      };
    }

    return super._request(method, params, options);

  }

}

export class ReplyHandler {

  sub;
  timeout;

  constructor(resolve, reject, timeout) {
    
    this.resolve = resolve;
    this.reject = reject;

    if (timeout > 0) {
      this.replyTimeout(this.reject, timeout);
    }

  }

  replyTimeout(reject, timeout) {
    if (this.replyTimer !== undefined) {
      clearTimeout(this.replyTimer);
    }
    this.replyTimer = setTimeout(() => {
      this.unsubscribe();
      clearTimeout(this.replyTimer);
      this.replyTimer = undefined;
      reject(ERROR_TIMEOUT);
    }, timeout);
  }

  callback(msg) {
    if (msg.ttl > 0) {

      if (this.reject) {
        this.replyTimeout(this.reject, msg.ttl + 500);
      }

    } else {
      if (this.replyTimer !== undefined) {
        clearTimeout(this.replyTimer);
      }

      this.unsubscribe();

      if (msg.error) {
        this.reject(ConnectException.create(msg.payload.statusCode, 'reply error', msg.error.body));
      } else {
        this.resolve(msg.payload.body);
      }

    }
  }

  unsubscribe() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
