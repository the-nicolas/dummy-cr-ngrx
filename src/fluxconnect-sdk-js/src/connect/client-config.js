export class ClientConfig {

  constructor() {

  }

  getRestUrl() {
    return this._getCompletePath(this.restUrl);
  }
  
  getRetrieveToken() {
    return this.retrieveToken;
  }

  getWithCredentials() {
    return this.withCredentials;
  }
  
  getNatsOpts() {
    return this.natsOpts;
  }

  _getCompletePath(value) {

    let url = value;
    if (!url.endsWith('/')) {
      url += '/';
    }
    return url;

  }

}

ClientConfig._defaults = {

  // URL of the REST API server
  restUrl: '', // http://api.test.io
  // Timeout for getting any response. 0 for no timeout.
  restTimeout: 0, //TODO implement restTimeout
  
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
   */
  withCredentials: false,

  //client retrieves token itself, should be callback that returns Promise
  retrieveToken: null,
  natsEnabled: false,
  natsOpts: {
    url: '' // ws://api.test.io/connect
  }
};

ClientConfig.defaults = () => {

  let config = new ClientConfig();
  Object.assign(config, ClientConfig._defaults);
  return config;

};
