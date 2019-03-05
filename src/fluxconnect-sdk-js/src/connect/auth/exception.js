export class AuthenticationFailedException extends Error {

  constructor(message = 'Authentication failed') {
    super(message);
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      Object.defineProperty(this, 'stack', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: Error(message).stack
      });
    }

    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: message
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 'AuthenticationFailedException'
    });

  }
}

AuthenticationFailedException.Name = 'AuthenticationFailedException';

export class AuthenticationTimeoutException extends Error {

  constructor(message = 'Authentication timeout') {
    super(message);
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      Object.defineProperty(this, 'stack', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: Error(message).stack
      });
    }

    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: message
    });

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: 'AuthenticationTimeoutException'
    });

  }
}

AuthenticationTimeoutException.Name = 'AuthenticationTimeoutException';
