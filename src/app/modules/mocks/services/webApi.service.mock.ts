import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WebApiServiceMock {

  client: any;
  transactions: any;
  auth: any;

  constructor() {

  }

  initApi(apiCfg) {

  }

  setCredentials(credentials) {
      
  }

  serviceCallWrapper(service, func, args) {
    return {};
  }

  serviceResponseWrapper(promise) {
    return {}
  }

  wrapService(service, callWrapper, responseWrapper) {
    create: () => {
        return {}
      }
  }

  startLoader() {
  }

  stopLoader() {
  }

  successWrapper(response) {
    return {}
  }

  errorWrapper(error) {
    return {}
  }
}
