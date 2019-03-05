'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectApiApiService = require('../../connect/api/api-service');

var ServiceService = (function (_ApiService) {
  _inherits(ServiceService, _ApiService);

  function ServiceService() {
    _classCallCheck(this, ServiceService);

    _ApiService.call(this);
  }

  ServiceService.prototype.getEndpoint = function getEndpoint() {
    return ['services'];
  };

  ServiceService.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return ServiceService;
})(_connectApiApiService.ApiService);

exports.ServiceService = ServiceService;

ServiceService.Uid = ['api', 'v1', 'services'].join('.');