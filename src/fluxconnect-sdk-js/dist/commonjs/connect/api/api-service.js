'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _netChannel = require('../net/channel');

var _eventemitter3 = require('eventemitter3');

var _eventemitter32 = _interopRequireDefault(_eventemitter3);

var _utilMixins = require('../util/mixins');

var _utilMixins2 = _interopRequireDefault(_utilMixins);

var ApiService = (function () {
  function ApiService() {
    _classCallCheck(this, ApiService);

    Object.assign(this, new _eventemitter32['default'](), _eventemitter32['default'].prototype);
  }

  ApiService.prototype.configureWithContext = function configureWithContext(context) {

    this.getChannel = context.getChannel.bind(context);
    this.getServiceDefaultOptions = context.getServiceDefaultOptions.bind(context);
    this.randomUUID = context.randomUUID.bind(context);
  };

  ApiService.prototype.getDefaultOptions = function getDefaultOptions() {};

  ApiService.prototype.getEndpointPrefix = function getEndpointPrefix() {

    return ['api', 'v1'];
  };

  ApiService.prototype.getEndpoint = function getEndpoint() {

    throw new Error('override required');
  };

  ApiService.prototype.getEventTargets = function getEventTargets() {};

  ApiService.prototype.getUid = function getUid() {

    return this.getEndpointPrefix().concat(this.getEndpoint()).join('.').toLowerCase();
  };

  ApiService.prototype._parseMeta = function _parseMeta(data) {

    if (!data) {
      return data;
    }

    data.describe = function (property) {

      var _this = this;

      var res = property.split('.').reduce(function (collector, item) {
        return collector.properties[item];
      }, _this);

      if (res.type === 'object') {
        res.describe = this.describe;
      }

      return res;
    };

    return data;
  };

  ApiService.prototype.getMeta = function getMeta(options) {
    var _this2 = this;

    return this._meta && !options ? Promise.resolve(this._meta) : this.retrieveMeta(options).then(function (res) {
      _this2._meta = _this2._parseMeta(res.meta);
      return _this2._meta;
    });
  };

  ApiService.prototype.retrieveMeta = function retrieveMeta(options) {

    return Promise.resolve({});
  };

  ApiService.prototype.retrieve = function retrieve(id, queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      queryParams: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.generateRetrieveUrl = function generateRetrieveUrl(id, queryParams, options) {
    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      queryParams: queryParams
    };

    return this._generateUrl(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.retrieveWithAction = function retrieveWithAction(id, action, actionArg, queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      action: action,
      actionArg: actionArg,
      queryParams: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.generateRetrieveWithActionUrl = function generateRetrieveWithActionUrl(id, action, actionArg, queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      action: action,
      actionArg: actionArg,
      queryParams: queryParams
    };

    return this._generateUrl(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.retrieveList = function retrieveList(queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      queryParams: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.generateRetrieveListUrl = function generateRetrieveListUrl(queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      queryParams: queryParams
    };

    return this._generateUrl(_netChannel.Channel.METHOD.GET, params, options);
  };

  ApiService.prototype.create = function create(data, options, multipart) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      data: data,
      multipart: multipart
    };

    return this._request(_netChannel.Channel.METHOD.CREATE, params, options);
  };

  ApiService.prototype.update = function update(data, options, multipart) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: data.id,
      data: data,
      multipart: multipart
    };

    return this._request(_netChannel.Channel.METHOD.UPDATE, params, options);
  };

  ApiService.prototype.updateWithAction = function updateWithAction(id, action, actionArg, data, options, multipart) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      data: data,
      action: action,
      actionArg: actionArg,
      multipart: multipart
    };

    return this._request(_netChannel.Channel.METHOD.UPDATE, params, options);
  };

  ApiService.prototype.remove = function remove(id, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id
    };

    return this._request(_netChannel.Channel.METHOD.DELETE, params, options);
  };

  ApiService.prototype.removeWithAction = function removeWithAction(id, action, actionArg, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      action: action,
      actionArg: actionArg
    };

    return this._request(_netChannel.Channel.METHOD.DELETE, params, options);
  };

  ApiService.prototype.execute = function execute(id, action, actionArg, data, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: id,
      action: action,
      actionArg: actionArg,
      data: data
    };

    return this._request(_netChannel.Channel.METHOD.EXECUTE, params, options);
  };

  ApiService.prototype._request = function _request(method, params, options) {

    params.options = Object.assign({}, this.getServiceDefaultOptions(), this.getDefaultOptions(), options);
    return this.getChannel(params.options.channelConfig).request(method, params);
  };

  ApiService.prototype._generateUrl = function _generateUrl(method, params, options) {

    params.options = Object.assign({}, this.getServiceDefaultOptions(), this.getDefaultOptions(), options);
    return this.getChannel([_netChannel.Channel.REST]).generateUrl(method, params);
  };

  return ApiService;
})();

exports.ApiService = ApiService;

ApiService.createWithMixin = function (ServiceMixin) {

  var Mixed = _utilMixins2['default'](ApiService, ServiceMixin);
  return new Mixed();
};