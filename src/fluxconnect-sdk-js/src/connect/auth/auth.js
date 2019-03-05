import {Token} from './token';
import {AuthenticationFailedException} from './exception';
//import minilog from 'minilog';

export class Auth {

  constructor() {

  }

  configureWithContext(context) {

    this.getTokenStorage = context.getTokenStorage.bind(context);

  }

  getToken(extend) {

    return this.getStoredToken().then((token) => {

      if (token !== null && !token.isExpired()) {
        if (extend) {
          // TODO we need here different flow for token renewal, call retrieveNewToken() when token is about to expire
          // extend expire time on every token access, assuming the token is used, if not this could cause auth failure
          // token.setExpireTime();
          // this.storeToken(token);
        }

        return Promise.resolve(token);

      }


      if (token !== null && token.isExpired()) {

        return this.retrieveNewToken().catch((err) => {

          //minilog('apiconnect.auth').error('Token is expired');
          throw new AuthenticationFailedException('Token is expired: ' + err.message);

        });

      }

      return this.retrieveNewToken().catch((err) => {

        //minilog('apiconnect.auth').error('Credentials error');
        throw new AuthenticationFailedException('Cannot retrieve token: ' + err.message);

      });

    });

  }

  getStoredToken() {
    let storage = this.getTokenStorage();
    if (!storage) {
      let err = new AuthenticationFailedException('Token storage error');
      return Promise.reject(err);
    }
    return storage.getStoredToken().then((token) => {

      if (token && !(token instanceof Token)) {
        return Token.create(token);
      }

      return token;

    });
  }

  retrieveNewToken() {

    let storage = this.getTokenStorage();
    if (!storage) {
      let err = new AuthenticationFailedException('Token storage error');
      return Promise.reject(err);
    }

    return storage.retrieveNewToken();

  }

}
