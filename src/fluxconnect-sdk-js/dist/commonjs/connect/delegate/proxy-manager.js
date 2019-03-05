'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _apiApiExecService = require('../api/api-exec-service');

var _proxyDelegate = require('./proxy-delegate');

var _netChannel = require('../net/channel');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _msg = require('./msg');

var _utilMixins = require('../util/mixins');

var _utilMixins2 = _interopRequireDefault(_utilMixins);

var ERROR_TIMEOUT = new Error('timeout');

var ProxyManager = (function (_ApiExecService) {
  _inherits(ProxyManager, _ApiExecService);

  function ProxyManager(endpoint, replyTo) {
    _classCallCheck(this, ProxyManager);

    _ApiExecService.call(this);
    this.endpoint = endpoint;
    this.replyTo = replyTo;
  }

  ProxyManager.prototype.createProxyDelegate = function createProxyDelegate(ProxyMixin, replyTo, openMethod, closeMethod) {
    replyTo = this.replyTo + '.' + replyTo;
    var Proxy = _utilMixins2['default'](_proxyDelegate.ProxyDelegate, ProxyMixin);
    var d = new Proxy(replyTo, openMethod, closeMethod);
    d.getChannel = this.getChannel;
    d.getServiceDefaultOptions = this.getServiceDefaultOptions;
    d.getDefaultOptions = this.getDefaultOptions;
    d.getEndpointPrefix = this.getEndpointPrefix;
    d.getEndpoint = this.getEndpoint;
    d._request = this._request;
    d.randomUUID = this.randomUUID;
    d.methodCall = this.methodCall;
    return d;
  };

  ProxyManager.prototype.getDefaultOptions = function getDefaultOptions() {
    return {
      channelConfig: [_netChannel.Channel.NATS]
    };
  };

  ProxyManager.prototype.methodCall = function methodCall(method, data, replyTo, timeout) {
    var _this = this;

    var replyHandler = undefined;

    if (!replyTo) {
      replyTo = this.replyTo + '.' + this.randomUUID();
    }

    if (!(timeout > 0)) {
      timeout = _msg.DEFAULT_TTL_MS;
    }

    var pr = new Promise(function (resolve, reject) {

      replyHandler = new ReplyHandler(resolve, reject, timeout);

      _this._request(_netChannel.Channel.METHOD.SUBSCRIBE, { subject: replyTo, callback: replyHandler.callback.bind(replyHandler) }).then(function (sub) {

        replyHandler.sub = sub;

        var params = {
          endpoint: [method],
          data: data,
          replyTo: replyTo
        };

        return _this._request(_netChannel.Channel.METHOD.PUBLISH, params, { timeout: timeout });
      })['catch'](function (err) {
        replyHandler.unsubscribe();
        reject(err);
      });
    });

    return pr;
  };

  ProxyManager.prototype._request = function _request(method, params, options) {

    if (method !== _netChannel.Channel.METHOD.SUBSCRIBE) {

      var msg = params.data;

      if (!msg || msg && !_lodash2['default'].isFunction(msg.encode)) {
        msg = new _msg.TransportMsg();
        msg.ttl = parseInt(options.timeout, 10);
        msg.payload = new _msg.ApiMsgPayload(params.data);
      }

      params.data = msg.encode();
    }

    if (!params.subject && params.endpoint) {
      params.subject = this.getEndpointPrefix().concat(this.getEndpoint()).concat(params.endpoint).join('.');
    }

    if (_lodash2['default'].isFunction(params.callback)) {
      (function () {
        var cb = params.callback;
        params.callback = function (msg, reply, subj, sid) {
          cb(_msg.TransportMsg.decodeWithPayload(msg, params.payloadClass), reply, subj, sid);
        };
      })();
    }

    return _ApiExecService.prototype._request.call(this, method, params, options);
  };

  return ProxyManager;
})(_apiApiExecService.ApiExecService);

exports.ProxyManager = ProxyManager;

var ReplyHandler = (function () {
  function ReplyHandler(resolve, reject, timeout) {
    _classCallCheck(this, ReplyHandler);

    this.resolve = resolve;
    this.reject = reject;

    if (timeout > 0) {
      this.replyTimeout(this.reject, timeout);
    }
  }

  ReplyHandler.prototype.replyTimeout = function replyTimeout(reject, timeout) {
    var _this2 = this;

    if (this.replyTimer !== undefined) {
      clearTimeout(this.replyTimer);
    }
    this.replyTimer = setTimeout(function () {
      _this2.unsubscribe();
      clearTimeout(_this2.replyTimer);
      _this2.replyTimer = undefined;
      reject(ERROR_TIMEOUT);
    }, timeout);
  };

  ReplyHandler.prototype.callback = function callback(msg) {
    if (msg.ttl > 0) {

      if (this.reject) {
        this.replyTimeout(this.reject, timeout + 500);
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
  };

  ReplyHandler.prototype.unsubscribe = function unsubscribe() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  };

  return ReplyHandler;
})();