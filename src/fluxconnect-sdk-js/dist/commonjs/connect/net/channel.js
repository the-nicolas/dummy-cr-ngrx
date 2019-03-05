'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Channel = (function () {
  function Channel() {
    _classCallCheck(this, Channel);
  }

  Channel.prototype.send = function send() {};

  Channel.prototype.request = function request(method, params) {};

  return Channel;
})();

exports.Channel = Channel;

Channel.REST = 'rest';
Channel.NATS = 'nats';

Channel.METHOD = {
  GET: 'GET',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXECUTE: 'EXECUTE',
  PUBLISH: 'PUBLISH',
  SUBSCRIBE: 'SUBSCRIBE'
};