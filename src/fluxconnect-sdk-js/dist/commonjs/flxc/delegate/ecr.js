'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectDelegateProxyManager = require('../../connect/delegate/proxy-manager');

var EcrManager = (function (_ProxyManager) {
  _inherits(EcrManager, _ProxyManager);

  function EcrManager() {
    _classCallCheck(this, EcrManager);

    _ProxyManager.call(this, EcrManager.Uid, 'api.cl.ecr');
  }

  EcrManager.prototype.connect = function connect(id, timeout) {

    var replyTo = id + '.ctx.' + this.randomUUID();
    var openMethod = 'connect';
    var closeMethod = 'disconnect';

    var d = this.createProxyDelegate(EcrProxy, replyTo, openMethod, closeMethod);

    return d.init(id, timeout).then(function (_) {
      return d;
    });
  };

  EcrManager.prototype.getEndpoint = function getEndpoint() {
    return ['ecr', 'default'];
  };

  EcrManager.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return EcrManager;
})(_connectDelegateProxyManager.ProxyManager);

exports.EcrManager = EcrManager;

EcrManager.Uid = ['api', 'v1', 'ecr', 'default'].join('.');

var EcrProxy = (function () {
  function EcrProxy() {
    _classCallCheck(this, EcrProxy);
  }

  EcrProxy.prototype.createTransaction = function createTransaction(data, timeout) {

    var openMethod = 'createTransaction';
    var closeMethod = '';
    var d = this.createChildProxyDelegate(TxProxy, openMethod, closeMethod);

    return d.init(JSON.stringify(data), timeout).then(function (_) {
      return d;
    });
  };

  EcrProxy.prototype.disconnect = function disconnect(timeout) {
    return this.proxyClose(timeout);
  };

  EcrProxy.prototype.ping = function ping(msg, timeout) {

    return this.methodCall('ping', msg, undefined, timeout);
  };

  return EcrProxy;
})();

var TxProxy = function TxProxy() {
  _classCallCheck(this, TxProxy);
};