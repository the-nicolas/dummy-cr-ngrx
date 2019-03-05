import { ProxyManager } from '../../connect/delegate/proxy-manager';

export class DummyManager extends ProxyManager {

  constructor() {
    super(DummyManager.Uid, 'cl.api.dummy');
  }

  /**
   * @param {string} id
   * @param {Number} timeout
   * @returns {Promise<DummyProxy>}
   */
  connect(id, timeout) {
    
    let replyTo = `${id}.ctx.${this.randomUUID()}`;
    let openMethod = 'connect';
    let closeMethod = 'disconnect';

    let d = this.createProxyDelegate(DummyProxy, replyTo, openMethod, closeMethod);
    // d = Object.assign(d, new DummyProxy());
    return d.init(id, timeout).then(_ => {
      return d;
    });

  }

  ping(msg, timeout) {

    return this.methodCall('ping', msg, undefined, timeout);

  }

  pingLong(msg, timeout) {

    return this.methodCall('pingLong', msg, undefined, timeout);

  }

  getEndpoint() {
    return ['example', 'dummy'];
  }

  getEventTargets() {
    return [];
  }

}

DummyManager.Uid = (['api', 'v1', 'example', 'dummy']).join('.');

class DummyProxy {

  /**
   * @param {*} data
   * @param {Number} timeout
   * @returns {Promise<DummyProxy>}
   */
  createTransaction(data, timeout) {
    
    let openMethod = 'createTransaction';
    let closeMethod = '';
    let d = this.createChildProxyDelegate(TxProxy, openMethod, closeMethod);
    
    return d.init(JSON.stringify(data), timeout).then(_ => {
      return d;
    });

  }

  /**
   * @param {Number} timeout
   * @returns {Promise<boolean>}
   */
  disconnect(timeout) {
    return this.proxyClose(timeout);
  }

  ping(msg, timeout) {

    return this.methodCall('pingd', msg, undefined, timeout);

  }

  notify(typ, msg, timeout) {
    return this.methodCall('notify', {Type: typ, Msg: msg}, undefined, timeout);
  }

  notifyAck(typ, msg, timeout) {
    return this.methodCall('notifyack', {Type: typ, Msg: msg}, undefined, timeout);
  }

  notifyReply(typ, msg, timeout) {
    return this.methodCall('notifyreply', {Type: typ, Msg: msg}, undefined, timeout);
  }

}

class TxProxy {
  
  ping(msg, timeout) {

    return this.methodCall('pingtx', msg, undefined, timeout);

  }

}
