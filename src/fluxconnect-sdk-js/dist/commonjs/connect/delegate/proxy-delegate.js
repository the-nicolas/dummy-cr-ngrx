'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _apiApiExecService = require('../api/api-exec-service');

var _netChannel = require('../net/channel');

var _msg = require('./msg');

var _utilPromiseTimeout = require('../util/promiseTimeout');

var _utilPromiseTimeout2 = _interopRequireDefault(_utilPromiseTimeout);

var _utilMixins = require('../util/mixins');

var _utilMixins2 = _interopRequireDefault(_utilMixins);

var _netException = require('../net/exception');

var ERROR_LIVELINESS_TIMEOUT = new Error('liveliness timeout');
var ERROR_CLOSE_NOT_AVAILABLE = new Error('close not available');

var ProxyDelegate = (function (_ApiExecService) {
  _inherits(ProxyDelegate, _ApiExecService);

  function ProxyDelegate(replyTo, openMethod, closeMethod) {
    _classCallCheck(this, ProxyDelegate);

    _ApiExecService.call(this);
    this.pubTarget = '';
    this.data = null;
    this.ttl = 0;
    this.delegateId = '';
    this.sub = undefined;
    this.resolveInit = undefined;
    this.rejectInit = undefined;
    this.resolveClosed = undefined;
    this.initTimer = undefined;
    this.activityTimer = undefined;
    this.replyTo = replyTo;
    this.openMethod = openMethod || 'open';
    this.closeMethod = closeMethod || 'close';
  }

  ProxyDelegate.prototype.createChildProxyDelegate = function createChildProxyDelegate(ProxyMixin, openMethod, closeMethod) {
    var _this = this;

    var replyTo = this.replyTo + '.' + this.randomUUID();
    var Proxy = _utilMixins2['default'](ProxyDelegate, ProxyMixin);
    var d = new Proxy(replyTo, openMethod, closeMethod);
    d.getChannel = this.getChannel;
    d.getServiceDefaultOptions = this.getServiceDefaultOptions;
    d.getDefaultOptions = this.getDefaultOptions;
    d.getEndpointPrefix = function () {
      return [];
    };
    d.getEndpoint = function () {
      return _this.pubTarget;
    };
    d._request = this._request;
    d.randomUUID = this.randomUUID;
    return d;
  };

  ProxyDelegate.prototype.init = function init(data, timeout) {
    var _this2 = this;

    var pr = new Promise(function (resolve, reject) {

      _this2.resolveInit = resolve;
      _this2.rejectInit = reject;

      if (!(timeout > 0)) {
        timeout = _msg.DEFAULT_TTL_MS;
      }

      if (timeout > 0) {
        _this2.initTimeout(reject, timeout);
      }

      _this2._request(_netChannel.Channel.METHOD.SUBSCRIBE, { subject: _this2.replyTo, callback: _this2.initCallback.bind(_this2) }).then(function (sub) {

        _this2.sub = sub;

        var params = {
          endpoint: [_this2.openMethod],
          data: data,
          replyTo: _this2.replyTo
        };

        return _this2._request(_netChannel.Channel.METHOD.PUBLISH, params, { timeout: timeout });
      })['catch'](function (err) {
        if (_this2.sub) {
          _this2.sub.unsubscribe();
        }
        reject(err);
      });
    });

    return pr;
  };

  ProxyDelegate.prototype.initTimeout = function initTimeout(reject, timeout) {
    var _this3 = this;

    if (this.initTimer !== undefined) {
      clearTimeout(this.initTimer);
    }
    this.initTimer = setTimeout(function (_) {
      if (_this3.sub) {
        _this3.sub.unsubscribe();
      }
      clearTimeout(_this3.initTimer);
      _this3.initTimer = undefined;
      reject(_msg.ERROR_TIMEOUT);
    }, timeout);
  };

  ProxyDelegate.prototype.initCallback = function initCallback(msg, reply) {
    var _this4 = this;

    if (msg.delegateId) {

      console.log('init', msg);

      this.pubTarget = reply;
      if (msg.payload) {
        this.data = msg.payload.body;
      }

      this.delegateId = msg.delegateId;

      if (this.initTimer) {
        clearTimeout(this.initTimer);
      }

      if (this.resolveInit) {
        this.resolveInit(this.data);
        this.resolveInit = undefined;
      }

      this.handleActivity(msg.ttl);
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
        this.processError(msg.error);
      } else {
        clearTimeout(this.initTimer);

        this.rejectInit(_netException.ConnectException.create(msg.payload.statusCode, 'proxy delegate init error', msg.error.body));
      }
    } else if (msg.ttl > 0) {
      if (this.delegateId) {
        this.handleActivity(msg.ttl);
      } else {

        if (this.rejectInit !== undefined) {
          this.initTimeout(this.rejectInit, msg.ttl + 500);
        }
      }
      if (msg.Ack) {
        this.ackConfirm(this.pubTarget)['catch'](function (e) {
          _this4.processError(e);
        });
      }
    }
  };

  ProxyDelegate.prototype.ackConfirm = function ackConfirm(confirmTarget) {

    var msg = new _msg.TransportMsg();
    msg.ctrl = true;
    msg.ackConfirm = true;

    var params = {
      subject: confirmTarget,
      data: msg,
      replyTo: this.replyTo
    };

    return this._request(_netChannel.Channel.METHOD.PUBLISH, params);
  };

  ProxyDelegate.prototype._publish = function _publish(method, msg, replyTo) {

    var params = {
      subject: this.pubTarget + '.' + method,
      data: msg,
      replyTo: replyTo || ''
    };

    return this._request(_netChannel.Channel.METHOD.PUBLISH, params);
  };

  ProxyDelegate.prototype.handleActivity = function handleActivity(ttl) {
    var _this5 = this;

    if (!ttl) {
      ttl = _msg.DEFAULT_TTL_MS;
    }

    if (this.activityTimer !== undefined) {
      clearTimeout(this.activityTimer);
    }

    this.activityTimer = setTimeout(function () {

      clearTimeout(_this5.activityTimer);
      _this5.activityTimer = undefined;

      _this5.sub.unsubscribe();
      _this5.processError(ERROR_LIVELINESS_TIMEOUT);
      _this5.handleClosed();
    }, ttl + 500);
  };

  ProxyDelegate.prototype.processError = function processError(err) {
    this.emit('error', err);
  };

  ProxyDelegate.prototype.handleClosed = function handleClosed() {
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
  };

  ProxyDelegate.prototype.proxyClose = function proxyClose(timeout) {
    var _this6 = this;

    if (!this.closeMethod) {
      return Promise.reject(ERROR_CLOSE_NOT_AVAILABLE);
    }

    var pr = new Promise(function (resolve, reject) {

      _this6.resolveClosed = resolve;

      var params = {
        subject: _this6.pubTarget + '.' + _this6.closeMethod,
        data: null,
        replyTo: ''
      };

      _this6._request(_netChannel.Channel.METHOD.PUBLISH, params, { timeout: timeout });
    });

    return timeout > 0 ? _utilPromiseTimeout2['default'](timeout, pr, _msg.ERROR_TIMEOUT) : pr;
  };

  return ProxyDelegate;
})(_apiApiExecService.ApiExecService);

exports.ProxyDelegate = ProxyDelegate;

ProxyDelegate.Mixin = function (ProxyMixin) {

  var Mixed = _utilMixins2['default'](ProxyDelegate, ProxyMixin);
  return new Mixed();
};