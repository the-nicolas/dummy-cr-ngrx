'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _apiService = require('./api-service');

var _netChannel = require('../net/channel');

var _utilMixins = require('../util/mixins');

var _utilMixins2 = _interopRequireDefault(_utilMixins);

var ApiExecService = (function (_ApiService) {
  _inherits(ApiExecService, _ApiService);

  function ApiExecService() {
    _classCallCheck(this, ApiExecService);

    _ApiService.call(this);
  }

  ApiExecService.prototype.retrieve = function retrieve(id, queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: 'get',
      data: { id: id },
      queryParams: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.EXECUTE, params, options);
  };

  ApiExecService.prototype.retrieveWithAction = function retrieveWithAction(id, action, queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: 'get' + action,
      data: { id: id },
      queryParams: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.EXECUTE, params, options);
  };

  ApiExecService.prototype.retrieveList = function retrieveList(queryParams, options) {

    var params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: 'list',
      data: queryParams
    };

    return this._request(_netChannel.Channel.METHOD.EXECUTE, params, options);
  };

  return ApiExecService;
})(_apiService.ApiService);

exports.ApiExecService = ApiExecService;

ApiExecService.createWithMixin = function (ServiceMixin) {

  var Mixed = _utilMixins2['default'](ApiExecService, ServiceMixin);
  return new Mixed();
};