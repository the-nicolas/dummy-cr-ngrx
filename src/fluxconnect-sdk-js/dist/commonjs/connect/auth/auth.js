'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _token = require('./token');

var _exception = require('./exception');

var Auth = (function () {
  function Auth() {
    _classCallCheck(this, Auth);
  }

  Auth.prototype.configureWithContext = function configureWithContext(context) {

    this.getTokenStorage = context.getTokenStorage.bind(context);
  };

  Auth.prototype.getToken = function getToken(extend) {
    var _this = this;

    return this.getStoredToken().then(function (token) {

      if (token !== null && !token.isExpired()) {
        if (extend) {}

        return Promise.resolve(token);
      }

      if (token !== null && token.isExpired()) {

        return _this.retrieveNewToken()['catch'](function (err) {
          throw new _exception.AuthenticationFailedException('Token is expired: ' + err.message);
        });
      }

      return _this.retrieveNewToken()['catch'](function (err) {
        throw new _exception.AuthenticationFailedException('Cannot retrieve token: ' + err.message);
      });
    });
  };

  Auth.prototype.getStoredToken = function getStoredToken() {
    var storage = this.getTokenStorage();
    if (!storage) {
      var err = new _exception.AuthenticationFailedException('Token storage error');
      return Promise.reject(err);
    }
    return storage.getStoredToken().then(function (token) {

      if (token && !(token instanceof _token.Token)) {
        return _token.Token.create(token);
      }

      return token;
    });
  };

  Auth.prototype.retrieveNewToken = function retrieveNewToken() {

    var storage = this.getTokenStorage();
    if (!storage) {
      var err = new _exception.AuthenticationFailedException('Token storage error');
      return Promise.reject(err);
    }

    return storage.retrieveNewToken();
  };

  return Auth;
})();

exports.Auth = Auth;