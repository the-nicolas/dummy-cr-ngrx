export class ConnectException {
  constructor(status, message, body) {

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      Object.defineProperty(this, 'stack', {
        configurable: true,
        enumerable: false,
        value: Error(`${status} ${message}`).stack
      });
    }

    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      value: `${status} ${body.error} ${body.traceID || ''}`
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

  }
}

ConnectException.create = (status, message, body) => {

  let error = new ConnectException(status, message, body);
  return error;
  
};
