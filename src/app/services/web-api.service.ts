import { Injectable } from '@angular/core';
import { FluxConnect, Services } from 'fluxconnect-sdk';
import { TokenStorageMixin } from '../api-mixin/TokenStorageMixin';
import { AuthMixin } from '../api-mixin/AuthMixin';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  client: any;
  transactions: any;
  auth: any;

  constructor() {
    console.log('WebApiProvider', FluxConnect, TokenStorageMixin);
    this.initApi({
      restUrl: 'http://api.dev.flxc.io',
      //restUrl: 'http://localhost:3333',
      natsEnabled: true,
      natsOpts: {
        //url: "ws://localhost:3388"
        url: "ws://api.dev.flxc.io/connect"
      }
    });

  }

  initApi(apiCfg) {

    this.client = FluxConnect.create(apiCfg);

    //console.log('WebApiProvider', this.client);
    this.client.setCredentials({ token: TokenStorageMixin.getStoredToken() }, TokenStorageMixin);
    this.auth = this.wrapService(this.client.addService(AuthMixin), this.serviceCallWrapper.bind(this), this.serviceResponseWrapper.bind(this));
    //this.devices = this.wrapService(this.client.getService(Services.Devices), this.serviceCallWrapper.bind(this), this.serviceResponseWrapper.bind(this));
    //this.services = this.wrapService(this.client.getService(Services.Services), this.serviceCallWrapper.bind(this), this.serviceResponseWrapper.bind(this));
    this.transactions = this.wrapService(this.client.getService(Services.Transactions), this.serviceCallWrapper.bind(this), this.serviceResponseWrapper.bind(this));
    //this.units = this.wrapService(this.client.getService(Services.Units), this.serviceCallWrapper.bind(this), this.serviceResponseWrapper.bind(this));
  }

  setCredentials(credentials) {
    this.client.setCredentials(credentials, TokenStorageMixin);
  }

  serviceCallWrapper(service, func, args) {
    this.startLoader();
    return func.apply(service, args);
  }

  serviceResponseWrapper(promise) {
    return promise.then(this.successWrapper.bind(this)).catch(this.errorWrapper.bind(this));
  }

  wrapService(service, callWrapper, responseWrapper) {

    //console.log('wrapService', service);

    return {

      service: service,

      callCustom: (method, ...args) => {
        return responseWrapper(callWrapper(service, service[method], args));
      },

      getMeta: (...args) => {
        return responseWrapper(callWrapper(service, service.getMeta, args));
      },

      retrieve: (...args) => {
        return responseWrapper(callWrapper(service, service.retrieve, args));
      },

      retrieveWithAction: (...args) => {
        return responseWrapper(callWrapper(service, service.retrieveWithAction, args));
      },

      retrieveList: (...args) => {
        return responseWrapper(callWrapper(service, service.retrieveList, args));
      },

      create: (...args) => {
        return responseWrapper(callWrapper(service, service.create, args));
      },

      update: (...args) => {
        return responseWrapper(callWrapper(service, service.update, args));
      },

      updateWithAction: (...args) => {
        return responseWrapper(callWrapper(service, service.updateWithAction, args));
      },

      remove: (...args) => {
        return responseWrapper(callWrapper(service, service.remove, args));
      },

      removeWithAction: (...args) => {
        return responseWrapper(callWrapper(service, service.removeWithAction, args));
      },

      execute: (...args) => {
        return responseWrapper(callWrapper(service, service.execute, args));
      }
    }

  }

  startLoader() {
    //this.ea.publish(new LoadStartMsg());
  }

  stopLoader() {
    //this.ea.publish(new LoadEndMsg());
  }

  successWrapper(response) {
    console.log('WebApi.successWrapper', response);
    this.stopLoader();
    return response;
  }

  errorWrapper(error) {

    // console.log('WebApi.errorWrapper', error.error, error.message);

    this.stopLoader();
    //this.ea.publish(new AuthErrorMsg());
    if (error.error == 'ProductInternalException' || error.error == 'ProductNotFound') {

    } else if (error.message == 'Token is expired' || error.message == 'Invalid token') {
      // this.ea.publish(new AuthErrorMsg());
      // don't throw error on auth error
      return;
    }

    let err = new Error(`${error.error}: ${error.message}`);

    if (error.error == 'ProductFormatException') {

      try {
        (err as any).details = JSON.parse(error.message);
      } catch (e) {
        (err as any).user = error.message
      }

    } else {
      err.message = error.message;
      // TODO not nice to have this check
      if (error.error_user != 'Es ist ein unbekannter Fehler aufgetreten') {
        // show only custom errors
        (err as any).user = error.error_user;
      }
    }

    (err as any).errType = error.error;

    throw err;

  }

}
