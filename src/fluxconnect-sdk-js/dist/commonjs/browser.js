'use strict';

exports.__esModule = true;

var _connectClient = require('./connect/client');

var _flxcClientBrowserEnvironment = require('./flxc/client-browser-environment');

var _connectNetChannel = require('./connect/net/channel');

exports.Channel = _connectNetChannel.Channel;

var _connectAuthToken = require('./connect/auth/token');

exports.Token = _connectAuthToken.Token;
exports.Services = _flxcClientBrowserEnvironment.ServiceMap;

var _apiConnectBase = require('./api-connect-base');

exports.ApiConnectBase = _apiConnectBase.ApiConnectBase;
var FluxConnect = {
  description: 'Api for browser'
};

exports.FluxConnect = FluxConnect;
FluxConnect.create = function (config) {

  return _connectClient.Client.create(config, _flxcClientBrowserEnvironment.ClientBrowserEnvironment);
};