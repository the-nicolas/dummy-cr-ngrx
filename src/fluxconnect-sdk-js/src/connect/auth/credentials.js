export class Credentials {

  constructor() {

    /*
     ---- basic ------
     */
    this.client_id = null;
    this.client_secret = null;

    // ---------------
    this.uuid = null;
    // ---------------
    this.code = null;
    // ---------------
    this.username = null;
    this.password = null;
    this.device = null;
    this.deviveinfo = {name: null};

  }

  isValid() {
    return this.client_id && this.client_secret;
  }

}

Credentials.create = (credentials) => {

  let cr = new Credentials();
  return Object.assign(cr, credentials);

};
