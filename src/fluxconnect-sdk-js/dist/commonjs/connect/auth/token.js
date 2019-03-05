'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Token = (function () {
  function Token() {
    _classCallCheck(this, Token);

    this.access = {
      token: null,
      header: null
    };
  }

  Token.prototype.isExpired = function isExpired() {

    return false;
  };

  Token.prototype.update = function update(data) {
    return Object.assign(this, data);
  };

  return Token;
})();

exports.Token = Token;

Token.create = function (data) {
  var token = new Token();
  token = Object.assign(token, data);
  return token;
};

Token.isValid = function (data) {

  return data && data.hasOwnProperty('access') && data.access.token;
};