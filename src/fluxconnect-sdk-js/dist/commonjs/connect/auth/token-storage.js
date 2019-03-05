'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _token = require('./token');

var _utilMixins = require('../util/mixins');

var _utilMixins2 = _interopRequireDefault(_utilMixins);

var TokenStorageInMem = (function () {
  function TokenStorageInMem() {
    _classCallCheck(this, TokenStorageInMem);
  }

  TokenStorageInMem.prototype.setCredentials = function setCredentials(credentials) {
    this.credentials = credentials;

    var token = null;

    if (credentials.token) {
      token = _token.Token.create(credentials.token);
      delete credentials.token;
    }

    return this.storeToken(token).then();
  };

  TokenStorageInMem.prototype.removeToken = function removeToken() {
    this.token = null;
    return Promise.resolve(this.token);
  };

  TokenStorageInMem.prototype.storeToken = function storeToken(token) {

    this.token = token ? token : null;
    return Promise.resolve(this.token);
  };

  TokenStorageInMem.prototype.getStoredToken = function getStoredToken() {

    return Promise.resolve(this.token);
  };

  TokenStorageInMem.prototype.retrieveNewToken = function retrieveNewToken() {
    var _this = this;

    var retrieveToken = this.getRetrieveToken();

    if (_lodash2['default'].isFunction(retrieveToken)) {

      if (this.retrievingToken) {
        return this.retrievingToken;
      }

      this.retrievingToken = retrieveToken().then(function (token) {
        delete _this.retrievingToken;

        if (!_token.Token.isValid(token)) {
          var err = 'Retrieved token from ' + JSON.stringify(token) + ' is not valid';

          throw new Error(err);
        }

        return _this.storeToken(token);
      })['catch'](function (err) {
        console.log(err);
        delete _this.retrievingToken;
        throw err;
      });

      return this.retrievingToken;
    }

    return Promise.reject(new Error('retrieveToken is not defined'));
  };

  return TokenStorageInMem;
})();

exports.TokenStorageInMem = TokenStorageInMem;

TokenStorageInMem.createWithMixin = function (TokenStorageMixin) {

  var Mixed = _utilMixins2['default'](TokenStorageInMem, TokenStorageMixin);
  return new Mixed();
};