import _ from 'lodash';
import {Token} from './token';
import mixins from '../util/mixins';
//import minilog from 'minilog';

export class TokenStorageInMem {

  constructor() {

  }

  setCredentials(credentials) {

    // use credentials as additional data and primary source when storing token
    this.credentials = credentials;

    let token = null;

    if (credentials.token) {
      token = Token.create(credentials.token);
      delete credentials.token;
    }

    return this.storeToken(token).then();

  }

  removeToken() {
    this.token = null;
    return Promise.resolve(this.token);
  }

  storeToken(token) {

    this.token = token ? token : null;
    return Promise.resolve(this.token);

  }

  getStoredToken() {

    return Promise.resolve(this.token);

  }

  /**
   * called when token is not defined or expired
   */
  retrieveNewToken() {
    
    let retrieveToken = this.getRetrieveToken();

    if (_.isFunction(retrieveToken)) {

      if (this.retrievingToken) {
        return this.retrievingToken;
      }

      this.retrievingToken = retrieveToken().then((token) => {
        delete this.retrievingToken;

        if (!Token.isValid(token)) {
          let err = `Retrieved token from ${JSON.stringify(token)} is not valid`;
          //minilog('apiconnect.TokenStorageInMem').error(`${err}`);
          throw new Error(err);
        }

        return this.storeToken(token);
      }).catch((err) => {
        console.log(err);
        delete this.retrievingToken;
        throw err;
      });

      return this.retrievingToken;

    }

    return Promise.reject(new Error('retrieveToken is not defined'));

  }

}

TokenStorageInMem.createWithMixin = (TokenStorageMixin) => {

  let Mixed = mixins(TokenStorageInMem, TokenStorageMixin);
  return new Mixed();

};
