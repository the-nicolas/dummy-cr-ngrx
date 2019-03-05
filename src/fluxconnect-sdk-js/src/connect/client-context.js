import _ from 'lodash';
import {Rest} from './net/rest';
import {Auth} from './auth/auth';
import {Credentials} from './auth/credentials';
import {ApiService} from './api/api-service';
import {Channel} from './net/channel';
import EE from 'eventemitter3';
import {TokenStorageInMem} from './auth/token-storage';

export class ClientContext {

  constructor(config, environment) {

    Object.assign(this, EE.prototype);

    if (environment.randomUUID) {
      this.randomUUID = environment.randomUUID;
    }

    this.tokenStorageCreate = environment.TokenStorage.create;

    let auth = new Auth();
    auth.configureWithContext(this);
    this.auth = auth;

    let restChannel = new Rest();
    restChannel.configureWithContext(this);
    this.restChannel = restChannel;
    this.channels = {
      rest: this.restChannel,
    }

    if (config.natsEnabled) {
      let natsChannel = environment.NatsChannel.create();
      natsChannel.configureWithContext(this);
      this.natsChannel = natsChannel;
      this.channels.nats = this.natsChannel;
    }

    this.serviceEventTargets = Object.create(null);

    this.createServices(environment.services);

    this.config = config;

  }

  open() {

    return this.getAuth().getToken().then(()=> {

      if (!this.config.natsEnabled) {
        return true;
      }

      return Promise.all(_.map(_.values(this.channels), (channel) => {
        return channel.open();
      }));

    });

  }
  
  close() {

    if (!this.config.natsEnabled) {
      return Promise.resolve(false);
    }

    return Promise.all(_.map(_.values(this.channels), (channel) => {
      return channel.close();
    }));
    
  }
  
  get opened() {
    
    return _.every(_.values(this.channels), 'opened');
    
  }

  createServices(classList) {

    let services = Object.create(null);
    let ServiceClass;
    let service;
    let uid;
    for (let i = 0; i < classList.length; i++) {

      ServiceClass = classList[i];
      service = new ServiceClass();
      service.configureWithContext(this);
      uid = service.getUid();
      services[uid] = service;
      this.registerServiceEventTargets(service, service.getEventTargets());
    }

    this.services = services;

  }

  getService(uid) {
    return this.services[uid.toLowerCase()];
  }

  addService(ServiceMixin) {

    let apiService = ApiService.createWithMixin(ServiceMixin);
    apiService.configureWithContext(this);
    apiService.isCustom = true;
    this.services[apiService.getUid()] = apiService;
    this.registerServiceEventTargets(apiService, apiService.getEventTargets());
    return apiService;
  }

  removeService(uid) {

    let apiService = this.services[uid];

    if (apiService && apiService.isCustom) {

      this.unregisterServiceEventTargets(apiService.getEventTargets());
      delete this.services[uid];

    } else {
      throw new Error('Service not found: ' + uid); // TODO custom errors
    }

  }

  setCredentials(credentials, TokenStorageMixin) {

    this.credentials = Credentials.create(credentials);
    if (TokenStorageMixin) {
      this.tokenStorage = TokenStorageInMem.createWithMixin(TokenStorageMixin);
    } else {
      this.tokenStorage = this.tokenStorageCreate();
    }
    this.tokenStorage.getRetrieveToken = this.config.getRetrieveToken.bind(this.config);

    return this.tokenStorage.setCredentials(Object.assign({}, credentials));

  }

  getCredentials() {
    return this.credentials;
  }

  getTokenStorage() {
    return this.tokenStorage;
  }

  getStoredToken() {
    return this.tokenStorage ? this.tokenStorage.getStoredToken() : Promise.resolve(null);
  }

  exportToken(isRaw) {
    return this.getAuth().getToken().then((token) => {

      if (token) {
        return !isRaw ? _.pick(token, ['access_token', 'expireTime', 'scope', 'expires_in']) : token;
      }
      
      return null;
    });
  }

  getConfig() {
    return this.config;
  }

  getAuth() {
    return this.auth;
  }

  getChannel(channelConfig) {

    let ch = null;
    _.each(_(channelConfig).reverse().value(), (type)=> {
      if (this.getChannelByType(type)) {
        ch = this.getChannelByType(type);
      }
    });
    if (!ch) {
      // TODO custom error
      throw new Error('Channel not found, please, check channel config for the service: ' + JSON.stringify(channelConfig));
    }
    return ch;
  }

  getChannelByType(type) {

    return this.channels[type];

  }

  getRestChannel() {
    return this.restChannel;
  }

  getNatsChannel() {
    return this.natsChannel;
  }

  getServiceDefaultOptions() {

    return {
      // rest is preferred
      channelConfig: [Channel.REST, Channel.NATS],
      useAuth: true
    };

  }

  isRequestWithToken(options) {

    return !options || (options && (!options.hasOwnProperty('useAuth') || options.useAuth));

  }

  registerServiceEventTargets(service, targets) {

    _.each(targets, (target) => {

      if (this.serviceEventTargets[target.toLowerCase()]) {
        throw new Error('Provided event target is registered already: ' + target.toLowerCase()); //TODO custom errors
      }

      this.serviceEventTargets[target.toLowerCase()] = service;

    });

  }

  unregisterServiceEventTargets(targets) {

    _.each(targets, (target) => {

      delete this.serviceEventTargets[target.toLowerCase()];

    });

  }

  emitServiceEvent(event, target, type, data) {

    if (event) {
      target = event.target || target;
      type = event.type || type;
      data = event.data || data;
    }

    target = target.toLowerCase();
    let service = this.serviceEventTargets[target];
    service.emit(type, data);

  }

  randomUUID() {
    return '';
  }

}
