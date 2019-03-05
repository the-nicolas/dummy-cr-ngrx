'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ConnectException = function ConnectException(status, message, body) {
  _classCallCheck(this, ConnectException);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    Object.defineProperty(this, 'stack', {
      configurable: true,
      enumerable: false,
      value: Error(status + ' ' + message).stack
    });
  }

  Object.defineProperty(this, 'message', {
    configurable: true,
    enumerable: false,
    value: status + ' ' + body.error + ' ' + (body.traceID || '')
  });

  Object.defineProperty(this, 'name', {
    configurable: true,
    enumerable: false,
    value: this.constructor.name
  });

  Object.defineProperty(this, 'status', {
    configurable: true,
    enumerable: false,
    value: status
  });

  Object.defineProperty(this, 'error', {
    configurable: true,
    enumerable: false,
    value: JSON.stringify(body)
  });

  Object.defineProperty(this, 'traceID', {
    configurable: true,
    enumerable: false,
    value: body.traceID || ''
  });
};

exports.ConnectException = ConnectException;

ConnectException.create = function (status, message, body) {

  var error = new ConnectException(status, message, body);
  return error;
};