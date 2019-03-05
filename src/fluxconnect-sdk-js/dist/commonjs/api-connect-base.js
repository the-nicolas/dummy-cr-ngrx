'use strict';

exports.__esModule = true;

var _connectClient = require('./connect/client');

var _connectAuthTokenStorage = require('./connect/auth/token-storage');

var _connectNetChannel = require('./connect/net/channel');

exports.Channel = _connectNetChannel.Channel;
var ApiConnectBase = {
  description: 'Api base client for browser'
};

exports.ApiConnectBase = ApiConnectBase;
var BaseEnvironment = {
  config: {},
  services: []
};

BaseEnvironment.TokenStorage = {
  create: function create() {
    return new _connectAuthTokenStorage.TokenStorageInMem();
  }
};

ApiConnectBase.create = function (config) {

  return _connectClient.Client.create(config, BaseEnvironment);
};