'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectApiApiExecService = require('../../connect/api/api-exec-service');

var UnitService = (function (_ApiExecService) {
  _inherits(UnitService, _ApiExecService);

  function UnitService() {
    _classCallCheck(this, UnitService);

    _ApiExecService.call(this);
  }

  UnitService.prototype.subs = function subs(id) {
    return this.retrieveWithAction(id, 'subs');
  };

  UnitService.prototype.services = function services(id) {
    return this.retrieveWithAction(id, 'services');
  };

  UnitService.prototype.devices = function devices(id) {
    return this.retrieveWithAction(id, 'devices');
  };

  UnitService.prototype.addService = function addService(data) {
    return this.execute('addservice', null, null, data);
  };

  UnitService.prototype.removeService = function removeService(data) {
    return this.execute('removeservice', null, null, data);
  };

  UnitService.prototype.getEndpoint = function getEndpoint() {
    return ['unit'];
  };

  UnitService.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return UnitService;
})(_connectApiApiExecService.ApiExecService);

exports.UnitService = UnitService;

UnitService.Uid = ['api', 'v1', 'unit'].join('.');