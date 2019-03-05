export class Token {

  constructor() {

    this.access = {
      token: null,
      header: null
    };

  }
  
  isExpired() {

    return false;

  }

  update(data) {
    return Object.assign(this, data);
  }
  
}

Token.create = (data) => {

  // TODO parse jwt to extract claims
  let token = new Token();
  token = Object.assign(token, data);
  return token;

};

Token.isValid = (data) => {

  return data && data.hasOwnProperty('access') && data.access.token;

};
