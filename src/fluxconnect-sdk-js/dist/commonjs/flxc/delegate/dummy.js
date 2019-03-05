'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _connectDelegateProxyManager = require('../../connect/delegate/proxy-manager');

var DummyManager = (function (_ProxyManager) {
  _inherits(DummyManager, _ProxyManager);

  function DummyManager() {
    _classCallCheck(this, DummyManager);

    _ProxyManager.call(this, DummyManager.Uid, 'api.cl.dummy');
  }

  DummyManager.prototype.connect = function connect(id, timeout) {

    var replyTo = id + '.ctx.' + this.randomUUID();
    var openMethod = 'connect';
    var closeMethod = 'disconnect';

    var d = this.createProxyDelegate(DummyProxy, replyTo, openMethod, closeMethod);

    return d.init(id, timeout).then(function (_) {
      return d;
    });
  };

  DummyManager.prototype.ping = function ping(msg, timeout) {

    return this.methodCall('ping', msg, undefined, timeout);
  };

  DummyManager.prototype.pingLong = function pingLong(msg, timeout) {

    return this.methodCall('pingLong', msg, undefined, timeout);
  };

  DummyManager.prototype.getEndpoint = function getEndpoint() {
    return ['example', 'dummy'];
  };

  DummyManager.prototype.getEventTargets = function getEventTargets() {
    return [];
  };

  return DummyManager;
})(_connectDelegateProxyManager.ProxyManager);

exports.DummyManager = DummyManager;

DummyManager.Uid = ['api', 'v1', 'example', 'dummy'].join('.');

var DummyProxy = (function () {
  function DummyProxy() {
    _classCallCheck(this, DummyProxy);
  }

  DummyProxy.prototype.createTransaction = function createTransaction(data, timeout) {

    var openMethod = 'createTransaction';
    var closeMethod = '';
    var d = this.createChildProxyDelegate(TxProxy, openMethod, closeMethod);

    return d.init(JSON.stringify(data), timeout).then(function (_) {
      return d;
    });
  };

  DummyProxy.prototype.disconnect = function disconnect(timeout) {
    return this.proxyClose(timeout);
  };

  DummyProxy.prototype.ping = function ping(msg, timeout) {

    return this.methodCall('ping', msg, undefined, timeout);
  };

  return DummyProxy;
})();

var TxProxy = function TxProxy() {
  _classCallCheck(this, TxProxy);
};