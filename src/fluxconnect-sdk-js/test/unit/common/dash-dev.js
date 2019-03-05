class DashboardMixin {
  
  getEndpointPrefix() {
    
    return ['api-DASHBOARD', 'v1'];
    
  }
  
  getEndpoint() {
    
    return [];
    
  }
  
  /**
   *
   * @param {*} credentials {login: username, password: password}
   */
  login(credentials) {
    return this.execute('auth', 'login', null, credentials);
  }

  getDefaultOptions() {
    return {
      channelConfig: ['rest'],
      useAuth: false
    };
  }
  
}
  
let processToken = response => {

  if (response.body && response.body.hasOwnProperty('error')) {
    
    // TODO parse headers to get localized error
    throw new Error(response.body.error);
    
  } else {

    return getTokenFromResponse(response);
    
  }
};

let getTokenFromResponse = (response) => {

  let tokenHeader = response.headers.authorization;
      
  if (tokenHeader) {

    let tokStr = tokenHeader.split('Bearer ')[1];
    let t = {access: {header: tokenHeader, token: tokStr}};
    return t;

  }

  throw new Error('Token not found in login response header');

}

export {DashboardMixin, processToken};