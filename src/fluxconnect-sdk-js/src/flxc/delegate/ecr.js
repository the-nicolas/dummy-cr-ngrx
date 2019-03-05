import { ProxyManager } from '../../connect/delegate/proxy-manager';

export class EcrManager extends ProxyManager {

  constructor() {
    super(EcrManager.Uid, 'cl.api.ecr');
  }

  /**
   * @param {string} id
   * @param {Number} timeout
   * @returns {Promise<EcrProxy>}
   */
  connect(id, timeout) {
    
    let replyTo = `${id}.ctx.${this.randomUUID()}`;
    let openMethod = 'connect';
    let closeMethod = 'disconnect';

    let d = this.createProxyDelegate(EcrProxy, replyTo, openMethod, closeMethod);
    // d = Object.assign(d, new EcrProxy());
    return d.init(id, timeout).then(_ => {
      return d;
    });

  }

  getEndpoint() {
    return ['ecr', 'default'];
  }

  getEventTargets() {
    return [];
  }

}

EcrManager.Uid = (['api', 'v1', 'ecr', 'default']).join('.');

class EcrProxy {

  /**
   * @param {*} data
   * @param {Number} timeout
   * @returns {Promise<EcrProxy>}
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

}

class TxProxy {

}
