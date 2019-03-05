'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectApiApiExecService = require('../../connect/api/api-exec-service');

var UserService = (function (_ApiExecService) {
  _inherits(UserService, _ApiExecService);

  function UserService() {
    _classCallCheck(this, UserService);

    _ApiExecService.call(this);
  }

  UserService.prototype.getEndpoint = function getEndpoint() {
    return ['user'];
  };

  UserService.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return UserService;
})(_connectApiApiExecService.ApiExecService);

exports.UserService = UserService;

UserService.Uid = ['api', 'v1', 'user'].join('.');