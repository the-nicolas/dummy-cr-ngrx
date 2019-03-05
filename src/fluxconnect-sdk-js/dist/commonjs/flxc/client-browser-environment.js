'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nuid = require('nuid');

var _nuid2 = _interopRequireDefault(_nuid);

var _connectNetNats = require('../connect/net/nats');

var _connectAuthTokenStorage = require('../connect/auth/token-storage');

var _websocketNats = require('websocket-nats');

var _websocketNats2 = _interopRequireDefault(_websocketNats);

var _serviceUserService = require('./service/user-service');

var _serviceDeviceService = require('./service/device-service');

var _serviceServiceService = require('./service/service-service');

var _serviceTransactionService = require('./service/transaction-service');

var _serviceUnitService = require('./service/unit-service');

var _delegateEcr = require('./delegate/ecr');

var _delegateDummy = require('./delegate/dummy');

var ClientBrowserEnvironment = {
  config: {},
  services: [_serviceUserService.UserService, _serviceDeviceService.DeviceService, _serviceServiceService.ServiceService, _serviceTransactionService.TransactionService, _serviceUnitService.UnitService, _delegateEcr.EcrManager]
};

exports.ClientBrowserEnvironment = ClientBrowserEnvironment;
ClientBrowserEnvironment.NatsChannel = {
  create: function create() {
    return new _connectNetNats.Nats(_websocketNats2['default']);
  }
};

ClientBrowserEnvironment.TokenStorage = {
  create: function create() {
    return new _connectAuthTokenStorage.TokenStorageInMem();
  }
};

ClientBrowserEnvironment.randomUUID = function () {
  return _nuid2['default'].next();
};

var ServiceMap = {
  Users: _serviceUserService.UserService.Uid,
  Devices: _serviceDeviceService.DeviceService.Uid,
  Services: _serviceServiceService.ServiceService.Uid,
  Transactions: _serviceTransactionService.TransactionService.Uid,
  Units: _serviceUnitService.UnitService.Uid,
  DummyManager: _delegateDummy.DummyManager.Uid,
  EcrManager: _delegateEcr.EcrManager.Uid
};
exports.ServiceMap = ServiceMap;