import {AuthenticationFailedException} from '../auth/exception';
import { Channel } from './channel';

export class Nats {

  /**
   * Constructor
   * @param {*} clientImpl
   */
  constructor(clientImpl) {
    this.nats = clientImpl;
    this.nc = null;
  }

  configureWithContext(context) {

    this.getToken = (extend) => {
      return context.getAuth().getToken(extend);
    };

    this.getNatsOpts = () => {
      return context.getConfig().getNatsOpts();
    };

  }

  open() {

    if (!this.nc || !this.nc.connected) {

      return this.connect();

    } else if (this.connectPromise) {

      return this.connectPromise;

    }

    return Promise.resolve(true);

  }

  close() {

    return this._disconnect();

  }
  
  get opened() {
    return this.nc && !this.nc.closed;
  }

  connect() {

    //minilog('apiconnect.nats').debug('stomp start connection');

    return this.getToken().then((token) => {
      //minilog('apiconnect.nats').debug('Got token', token);
      //console.log(token);
      return this._connect(token.access.token);
    });
  }

  _connect(accessToken) {

    if (!accessToken) {

      return this.close().then(() => {
        // don't login with empty token
        //throw new AuthenticationFailedException('Access token is not valid');
        return Promise.reject(new AuthenticationFailedException('Access token is not valid'));

      });

    }

    // TODO add timeout
    this.connectAccessToken = accessToken;

    this.connectPromise = new Promise((resolve, reject) => {

      let opts = Object.assign(this.getNatsOpts(), {
        token: this.connectAccessToken,
        maxReconnectAttempts: -1,
        preserveBuffers: true,
        waitOnFirstConnect: true
      });
      
      // 1. nats client will try to connect forever
      // 2. when got Authorization violation error on connect it throws error
      // 3. when got Authorization violation error when being connected with valid token that means token expired and re-connect required with new one
      // 4. TODO will publish msg with new token when token updated to revoke auth
      
      try {
        this.nc = this.nats.connect(opts);
      } catch (err) {
        reject(new Error('Invalid nats url. Use ws:// or wss:// instead of nats://'));
      }
      
      this._onError = (err) => {
        // called on error when connected
        console.log('Nats error: ', err);
        if (err.message === `'Authorization Violation'`) {
          // try to get new token
          this.getToken().then((token) => {
            this.connectAccessToken = token.access.token;
            this.nc.token = this.connectAccessToken;
          });
        }
      };
      
      this.nc.once('connect', (nc) => {
        
        console.log('Nats connected: ');
        this.nc.removeListener('error', this._onConnectError);
        this.nc.on('error', this._onError);
        resolve(true);
        
      });
      
      this._onConnectError = (err) => {
        // called on error when connecting
        console.log('Nats connect error: ', err);
        this.nc.removeListener('error', this._onConnectError);
        this.nc.close();
        if (err.message === `'Authorization Violation'`) {
          reject(new AuthenticationFailedException('Access token is not valid'));
        } else {
          reject(err);
        }
      };
      
      this.nc.on('error', this._onConnectError);
      
    });

    return this.connectPromise;

  }

  _disconnect() {

    return new Promise((resolve, reject) => {

      if (this.nc && !this.nc.connected) {
        resolve();
        return;
      }

      if (this.nc) {

        this.nc.close();

        let _onClose = () => {
          this.nc.removeAllListeners('close');
          resolve();
        };

        //TODO do we need to reject here?
        this.nc.on('close', _onClose);

      } else {

        resolve();

      }

    });

  }
  
  request(method, params) {
    
    let res;
    switch (method) {
    case Channel.METHOD.PUBLISH:
      res = this.publish(params.subject, params.data, params.replyTo);
      break;
    case Channel.METHOD.SUBSCRIBE:
      res = this.subscribe(params.subject, params.callback);
      break;
    default:
      throw new Error(`Request method: ${method} is not implemented for NATS channel`);
    }
    return Promise.resolve(res);
  }

  /**
   * Publish a message to the given subject, with optional reply and callback.
   *
   * @param {String} subject
   * @param {String} msg
   * @param {String} replyTo
   * @param {Function} callback
   */

  publish(subject, msg, replyTo) {

    if (this.nc) {
      return this.nc.publish(subject, msg, replyTo);
    }

    throw new Error('NATS channel is closed');

  }
  
  subscribe(subject, callback, opts) {
    
    if (this.nc) {
      
      let subscriptionId = !opts ? this.nc.subscribe(subject, callback) : this.nc.subscribe(subject, opts, callback);
      return {
        unsubscribe: () => {
          return this.nc.unsubscribe(subscriptionId);
        },
      };
      
    }

    throw new Error('NATS channel is closed');
    
  }

}
