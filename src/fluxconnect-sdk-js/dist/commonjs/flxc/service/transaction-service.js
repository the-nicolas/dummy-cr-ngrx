'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectApiApiExecService = require('../../connect/api/api-exec-service');

var TransactionService = (function (_ApiExecService) {
  _inherits(TransactionService, _ApiExecService);

  function TransactionService() {
    _classCallCheck(this, TransactionService);

    _ApiExecService.call(this);
  }

  TransactionService.prototype.getEndpoint = function getEndpoint() {
    return ['transaction', 'manage'];
  };

  TransactionService.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return TransactionService;
})(_connectApiApiExecService.ApiExecService);

exports.TransactionService = TransactionService;

TransactionService.Uid = ['api', 'v1', 'transaction', 'manage'].join('.');