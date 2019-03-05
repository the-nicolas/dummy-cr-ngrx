export class Channel {

  constructor() {

  }

  send() {

  }

  request(method, params) {


  }

}

Channel.REST = 'rest';
Channel.NATS = 'nats';

Channel.METHOD = {
  GET: 'GET',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  EXECUTE: 'EXECUTE',
  PUBLISH: 'PUBLISH',
  SUBSCRIBE: 'SUBSCRIBE',
};
