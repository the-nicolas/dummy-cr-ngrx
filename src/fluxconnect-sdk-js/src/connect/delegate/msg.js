import msgpack from 'msgpack5';
import _ from 'lodash';
import { Buffer } from 'safe-buffer';

export const DEFAULT_TTL_MS = 2 * 1000;
export const ERROR_TIMEOUT = new Error('timeout');
export const ERROR_REPLY_NOT_AVAILABLE = new Error('reply not available');

export const MSGPACK = msgpack();

export class MsgContext {
  subject  = '';
  replyTo = '';
  replied = false;
  ttl = 0;
  replyFunc = undefined;

  /**
   * @param {TransportMsg} msg
   * @param {string} replyFrom
   * @returns {Promise}
   */
  reply(msg, replyFrom) {
    
    if (!this.replyTo) {
      return Promise.reject(ERROR_REPLY_NOT_AVAILABLE);
    }

    return this.replyFunc(msg, replyFrom).then(() => {
      this.replied = true;
    });
  }

  /**
   * @param {Number} ttl
   * @returns {Promise}
   */
  replyTTL(ttl) {
    let msg = new TransportMsg();
    msg.ctrl = true;
    msg.ttl = parseInt(ttl, 10);
    return this.reply(msg);
  }

}

export class TransportMsg {
  ctrl = false;
  /**
   * milliseconds
   */
  ttl = 0;
  head = '';
  ackConfirm = false;
  ack = false;
  // isResult = false;
  closed = false;
  payload = null;
  error = null;

  encode(params) {
    
    let obj = this;
    if (this.payload && _.isFunction(this.payload.encode)) {
      obj = Object.assign({}, this, { payload: this.payload.encode(params)});
    }
    
    let included = [];
    // note that NaN values are not supported by MSGPACK, so should be avoided
    if (this.ctrl) {
      included.push('ctrl');
    }

    if (this.ackConfirm) {
      included.push('ackConfirm');
    }

    if (this.ack) {
      included.push('ack');
    }

    if (this.isResult) {
      included.push('isResult');
    }

    if (this.closed) {
      included.push('closed');
    }

    if (this.head) {
      included.push('head');
    }

    if (this.error) {
      included.push('error');
    }

    if (!_.isNaN(this.ttl) && this.ttl !== 0) {
      included.push('ttl');
    }

    if (this.payload) {
      included.push('payload');
    }

    return MSGPACK.encode(_.pick(obj, included));
  }

  decode(bytes) {
    let obj = MSGPACK.decode(bytes);
    if (obj.error !== null) {
      let buf = Buffer.from(obj.error.body);
      let str = buf.toString('utf8');
      obj.error = Object.assign(new MsgError(), obj.error, {body: JSON.parse(str || '{}')});
    }
    Object.assign(this, obj);
  }

}

/**
 * @param {*} bytes
 * @returns {TransportMsg}
 */
TransportMsg.decode = function(bytes) {
  let m = new TransportMsg();
  m.decode(bytes);
  return m;
};

/**
 * @param {*} bytes
 * @param {*} Class
 * @returns {TransportMsg}
 */
TransportMsg.decodeWithPayload = function(bytes, payloadClass) {
  let m = TransportMsg.decode(bytes);
  
  if (!m.payload || !m.payload.length) {
    return m;
  }

  let p;
  if (_.isFunction(payloadClass)) {
    p = new Class();
    Object.assign(p, MSGPACK.decode(bytes));
  } else {
    p = ApiMsgPayload.decode(m.payload);
  }

  m.payload = p;
  return m;

};

export class ApiMsgPayload {
  
  ot;
  body;
  claims;
  statusCode = 0;
  header;

  /**
   * @param {*} body
   */
  constructor(body) {
    this.body = body;
  }

  encode(params) {
    let obj = this;

    if (!params || params.body === 'json') {
      obj = Object.assign({}, this, { body: JSON.stringify(this.body) });
    }
    
    obj.body = Buffer.from(obj.body, 'utf8');

    let included = [];
    if (this.body) {
      included.push('body');
    }
    if (this.header) {
      included.push('header');
    }

    return MSGPACK.encode(_.pick(obj, included));
  }

  decode(bytes) {
    let obj = MSGPACK.decode(bytes);
    if (obj.body !== null) {
      let buf = Buffer.from(obj.body);
      let str = buf.toString('utf8');
      obj.body = JSON.parse(str || '{}');
    }
    Object.assign(this, obj);
  }
}

ApiMsgPayload.decode = function(bytes) {
  let m = new ApiMsgPayload();
  m.decode(bytes);
  return m;
};

export class MsgError {
  code = 0;
  errStr = '';
  body = null;
}

// function natsEncode(msg) {
//   return msg;
// }

// function natsDecode(msg) {
//   msg = MSGPACK.decode(msg);
//   msg.body = JSON.parse(msg.body.toString('utf8'));
//   return msg;
// }
