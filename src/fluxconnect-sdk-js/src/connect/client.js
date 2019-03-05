import {ClientConfig} from './client-config';
import {ClientContext} from './client-context';
import {Version} from './client-version';
//import minilog from 'minilog';

export class Client {

  constructor(config, environment) {

    this.config = config;
    this.context = new ClientContext(config, environment);
    this.getService = this.context.getService.bind(this.context);
    this.addService = this.context.addService.bind(this.context);
    this.removeService = this.context.removeService.bind(this.context);
    this.emitServiceEvent = this.context.emitServiceEvent.bind(this.context);
    this.on = this.context.on.bind(this.context);
    this.setCredentials = this.context.setCredentials.bind(this.context);
    this.getStoredToken = this.context.getStoredToken.bind(this.context);
    this.exportToken = this.context.exportToken.bind(this.context);
    this.connected = false;

    //minilog('apiconnect.client').debug(config);

  }

  open() {
    if (this.opened) {
      return Promise.resolve(true);
    }
    return this.context.open().then(() => {
      return true;
    });

  }

  close() {
    
    return this.context.close().then(() => {
      return false;
    });
    
  }
  
  get opened() {
    return this.context.opened;
  }
  
  getVersion() {
    return Version.name;
  }

}

Client.create = (config, environment) => {

  if (!config) {
    config = Object.create(null);
  }

  config = Object.assign(ClientConfig.defaults(), environment.config, config);

  return new Client(config, environment);

};
