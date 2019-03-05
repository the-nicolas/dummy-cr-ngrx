'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _clientConfig = require('./client-config');

var _clientContext = require('./client-context');

var _clientVersion = require('./client-version');

var Client = (function () {
  function Client(config, environment) {
    _classCallCheck(this, Client);

    this.config = config;
    this.context = new _clientContext.ClientContext(config, environment);
    this.getService = this.context.getService.bind(this.context);
    this.addService = this.context.addService.bind(this.context);
    this.removeService = this.context.removeService.bind(this.context);
    this.emitServiceEvent = this.context.emitServiceEvent.bind(this.context);
    this.on = this.context.on.bind(this.context);
    this.setCredentials = this.context.setCredentials.bind(this.context);
    this.getStoredToken = this.context.getStoredToken.bind(this.context);
    this.exportToken = this.context.exportToken.bind(this.context);
    this.connected = false;
  }

  Client.prototype.open = function open() {
    if (this.opened) {
      return Promise.resolve(true);
    }
    return this.context.open().then(function () {
      return true;
    });
  };

  Client.prototype.close = function close() {

    return this.context.close().then(function () {
      return false;
    });
  };

  Client.prototype.getVersion = function getVersion() {
    return _clientVersion.Version.name;
  };

  _createClass(Client, [{
    key: 'opened',
    get: function get() {
      return this.context.opened;
    }
  }]);

  return Client;
})();

exports.Client = Client;

Client.create = function (config, environment) {

  if (!config) {
    config = Object.create(null);
  }

  config = Object.assign(_clientConfig.ClientConfig.defaults(), environment.config, config);

  return new Client(config, environment);
};