'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _authException = require('../auth/exception');

var _channel = require('./channel');

var Nats = (function () {
  function Nats(clientImpl) {
    _classCallCheck(this, Nats);

    this.nats = clientImpl;
    this.nc = null;
  }

  Nats.prototype.configureWithContext = function configureWithContext(context) {

    this.getToken = function (extend) {
      return context.getAuth().getToken(extend);
    };

    this.getNatsOpts = function () {
      return context.getConfig().getNatsOpts();
    };
  };

  Nats.prototype.open = function open() {

    if (!this.nc || !this.nc.connected) {

      return this.connect();
    } else if (this.connectPromise) {

      return this.connectPromise;
    }

    return Promise.resolve(true);
  };

  Nats.prototype.close = function close() {

    return this._disconnect();
  };

  Nats.prototype.connect = function connect() {
    var _this = this;

    return this.getToken().then(function (token) {
      return _this._connect(token.access.token);
    });
  };

  Nats.prototype._connect = function _connect(accessToken) {
    var _this2 = this;

    if (!accessToken) {

      return this.close().then(function () {
        return Promise.reject(new _authException.AuthenticationFailedException('Access token is not valid'));
      });
    }

    this.connectAccessToken = accessToken;

    this.connectPromise = new Promise(function (resolve, reject) {

      var opts = Object.assign(_this2.getNatsOpts(), {
        token: _this2.connectAccessToken,
        maxReconnectAttempts: -1,
        preserveBuffers: true,
        waitOnFirstConnect: true
      });

      try {
        _this2.nc = _this2.nats.connect(opts);
      } catch (err) {
        reject(new Error('Invalid nats url. Use ws:// or wss:// instead of nats://'));
      }

      _this2._onError = function (err) {
        console.log('Nats error: ', err);
        if (err.message === '\'Authorization Violation\'') {
          _this2.getToken().then(function (token) {
            _this2.connectAccessToken = token.access.token;
            _this2.nc.token = _this2.connectAccessToken;
          });
        }
      };

      _this2.nc.once('connect', function (nc) {

        console.log('Nats connected: ');
        _this2.nc.removeListener('error', _this2._onConnectError);
        _this2.nc.on('error', _this2._onError);
        resolve(true);
      });

      _this2._onConnectError = function (err) {
        console.log('Nats connect error: ', err);
        _this2.nc.removeListener('error', _this2._onConnectError);
        _this2.nc.close();
        if (err.message === '\'Authorization Violation\'') {
          reject(new _authException.AuthenticationFailedException('Access token is not valid'));
        } else {
          reject(err);
        }
      };

      _this2.nc.on('error', _this2._onConnectError);
    });

    return this.connectPromise;
  };

  Nats.prototype._disconnect = function _disconnect() {
    var _this3 = this;

    return new Promise(function (resolve, reject) {

      if (_this3.nc && !_this3.nc.connected) {
        resolve();
        return;
      }

      if (_this3.nc) {

        _this3.nc.close();

        var _onClose = function _onClose() {
          _this3.nc.removeAllListeners('close');
          resolve();
        };

        _this3.nc.on('close', _onClose);
      } else {

        resolve();
      }
    });
  };

  Nats.prototype.request = function request(method, params) {

    var res = undefined;
    switch (method) {
      case _channel.Channel.METHOD.PUBLISH:
        res = this.publish(params.subject, params.data, params.replyTo);
        break;
      case _channel.Channel.METHOD.SUBSCRIBE:
        res = this.subscribe(params.subject, params.callback);
        break;
      default:
        throw new Error('Request method: ' + method + ' is not implemented for NATS channel');
    }
    return Promise.resolve(res);
  };

  Nats.prototype.publish = function publish(subject, msg, replyTo) {

    if (this.nc) {
      return this.nc.publish(subject, msg, replyTo);
    }

    throw new Error('NATS channel is closed');
  };

  Nats.prototype.subscribe = function subscribe(subject, callback, opts) {
    var _this4 = this;

    if (this.nc) {
      var _ret = (function () {

        var subscriptionId = !opts ? _this4.nc.subscribe(subject, callback) : _this4.nc.subscribe(subject, opts, callback);
        return {
          v: {
            unsubscribe: function unsubscribe() {
              return _this4.nc.unsubscribe(subscriptionId);
            }
          }
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    }

    throw new Error('NATS channel is closed');
  };

  _createClass(Nats, [{
    key: 'opened',
    get: function get() {
      return this.nc && !this.nc.closed;
    }
  }]);

  return Nats;
})();

exports.Nats = Nats;