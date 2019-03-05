'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _msgpack5 = require('msgpack5');

var _msgpack52 = _interopRequireDefault(_msgpack5);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _safeBuffer = require('safe-buffer');

var DEFAULT_TTL_MS = 2 * 1000;
exports.DEFAULT_TTL_MS = DEFAULT_TTL_MS;
var ERROR_TIMEOUT = new Error('timeout');

exports.ERROR_TIMEOUT = ERROR_TIMEOUT;
var MSGPACK = _msgpack52['default']();

exports.MSGPACK = MSGPACK;

var TransportMsg = (function () {
  function TransportMsg() {
    _classCallCheck(this, TransportMsg);

    this.ctrl = false;
    this.ttl = 0;
    this.delegateId = '';
    this.ackConfirm = false;
    this.ack = false;
    this.isResult = false;
    this.closed = false;
    this.payload = null;
    this.error = null;
  }

  TransportMsg.prototype.encode = function encode() {

    var obj = this;
    if (this.payload && _lodash2['default'].isFunction(this.payload.encode)) {
      obj = Object.assign({}, this, { payload: this.payload.encode() });
    }

    var included = [];

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

    if (this.delegateId) {
      included.push('delegateId');
    }

    if (this.error) {
      included.push('error');
    }

    if (!_lodash2['default'].isNaN(this.ttl) && this.ttl !== 0) {
      included.push('ttl');
    }

    if (this.payload) {
      included.push('payload');
    }

    return MSGPACK.encode(_lodash2['default'].pick(obj, included));
  };

  TransportMsg.prototype.decode = function decode(bytes) {
    var obj = MSGPACK.decode(bytes);
    if (obj.error !== null) {
      var buf = _safeBuffer.Buffer.from(obj.error.body);
      var str = buf.toString('utf8');
      obj.error = Object.assign(new MsgError(), obj.error, { body: JSON.parse(str || '{}') });
    }
    Object.assign(this, obj);
  };

  return TransportMsg;
})();

exports.TransportMsg = TransportMsg;

TransportMsg.decode = function (bytes) {
  var m = new TransportMsg();
  m.decode(bytes);
  return m;
};

TransportMsg.decodeWithPayload = function (bytes, payloadClass) {
  var m = TransportMsg.decode(bytes);

  if (!m.payload || !m.payload.length) {
    return m;
  }

  var p = undefined;
  if (_lodash2['default'].isFunction(payloadClass)) {
    p = new Class();
    Object.assign(p, MSGPACK.decode(bytes));
  } else {
    p = ApiMsgPayload.decode(m.payload);
  }

  m.payload = p;
  return m;
};

var ApiMsgPayload = (function () {
  function ApiMsgPayload(body) {
    _classCallCheck(this, ApiMsgPayload);

    this.statusCode = 0;

    this.body = body;
  }

  ApiMsgPayload.prototype.encode = function encode() {
    var obj = this;

    if (!_lodash2['default'].isString(this.body)) {
      obj = Object.assign({}, this, { body: JSON.stringify(this.body) });
    }

    obj.body = _safeBuffer.Buffer.from(obj.body, 'utf8');

    var included = [];
    if (this.body) {
      included.push('body');
    }
    if (this.Header) {
      included.push('Header');
    }

    return MSGPACK.encode(_lodash2['default'].pick(obj, included));
  };

  ApiMsgPayload.prototype.decode = function decode(bytes) {
    var obj = MSGPACK.decode(bytes);
    if (obj.body !== null) {
      var buf = _safeBuffer.Buffer.from(obj.body);
      var str = buf.toString('utf8');
      obj.body = JSON.parse(str || '{}');
    }
    Object.assign(this, obj);
  };

  return ApiMsgPayload;
})();

exports.ApiMsgPayload = ApiMsgPayload;

ApiMsgPayload.decode = function (bytes) {
  var m = new ApiMsgPayload();
  m.decode(bytes);
  return m;
};

var MsgError = function MsgError() {
  _classCallCheck(this, MsgError);

  this.code = 0;
  this.errStr = '';
  this.body = null;
};

exports.MsgError = MsgError;