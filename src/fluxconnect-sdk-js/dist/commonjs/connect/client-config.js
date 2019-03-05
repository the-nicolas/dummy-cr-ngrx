'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ClientConfig = (function () {
  function ClientConfig() {
    _classCallCheck(this, ClientConfig);
  }

  ClientConfig.prototype.getRestUrl = function getRestUrl() {
    return this._getCompletePath(this.restUrl);
  };

  ClientConfig.prototype.getRetrieveToken = function getRetrieveToken() {
    return this.retrieveToken;
  };

  ClientConfig.prototype.getWithCredentials = function getWithCredentials() {
    return this.withCredentials;
  };

  ClientConfig.prototype.getNatsOpts = function getNatsOpts() {
    return this.natsOpts;
  };

  ClientConfig.prototype._getCompletePath = function _getCompletePath(value) {

    var url = value;
    if (!url.endsWith('/')) {
      url += '/';
    }
    return url;
  };

  return ClientConfig;
})();

exports.ClientConfig = ClientConfig;

ClientConfig._defaults = {
  restUrl: '',
  restTimeout: 0,
  withCredentials: false,

  retrieveToken: null,
  natsEnabled: false,
  natsOpts: {
    url: '' }
};

ClientConfig.defaults = function () {

  var config = new ClientConfig();
  Object.assign(config, ClientConfig._defaults);
  return config;
};