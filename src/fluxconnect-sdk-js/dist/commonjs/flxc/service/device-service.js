'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectApiApiExecService = require('../../connect/api/api-exec-service');

var DeviceService = (function (_ApiExecService) {
  _inherits(DeviceService, _ApiExecService);

  function DeviceService() {
    _classCallCheck(this, DeviceService);

    _ApiExecService.call(this);
  }

  DeviceService.prototype.services = function services(id) {
    return this.retrieveWithAction(id, 'services');
  };

  DeviceService.prototype.enableService = function enableService(data) {
    return this.execute('enableservice', null, null, data);
  };

  DeviceService.prototype.disableService = function disableService(data) {
    return this.execute('disableservice', null, null, data);
  };

  DeviceService.prototype.getEndpoint = function getEndpoint() {
    return ['device', 'manage'];
  };

  DeviceService.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return DeviceService;
})(_connectApiApiExecService.ApiExecService);

exports.DeviceService = DeviceService;

DeviceService.Uid = ['api', 'v1', 'device', 'manage'].join('.');