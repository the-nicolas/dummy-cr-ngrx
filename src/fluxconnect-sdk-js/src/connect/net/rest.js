import Request from 'superagent';
import {GET, POST, PUT, HEAD, DELETE} from './message';
import {Message} from './message';
import {Channel} from './channel';
import {AuthenticationFailedException, AuthenticationTimeoutException} from '../auth/exception';
import {ConnectException} from './exception';
//import minilog from 'minilog';

export class Rest {

  constructor() {

    this.methodFuns = {};

    this.methodFuns[GET] = Request.get;
    this.methodFuns[POST] = Request.post;

    this.methodFuns[PUT] = Request.put;
    this.methodFuns[HEAD] = Request.head;
    this.methodFuns[DELETE] = Request.del;

    this.methodFuns[Channel.METHOD.GET] = Request.get;

    this.methodFuns[Channel.METHOD.CREATE] = Request.post;
    this.methodFuns[Channel.METHOD.EXECUTE] = Request.post;

    this.methodFuns[Channel.METHOD.UPDATE] = Request.put;
    this.methodFuns[Channel.METHOD.DELETE] = Request.del;

  }

  configureWithContext(context) {

    this.restUrl = () => {

      return context.getConfig().getRestUrl();

    };

    this.getToken = (extend) => {

      return context.getAuth().getToken(extend);

    };

    this.withCredentials = () => {

      return context.getConfig().getWithCredentials();

    };

    this.isRequestWithToken = context.isRequestWithToken.bind(context);

  }

  open() {
    return Promise.resolve(true);
  }
  
  close() {
    return Promise.resolve(true);
  }
  
  get opened() {
    return true;
  }

  /**
   *
   * @returns {Message}
   */
  createMessage() {
    let message = new Message();
    return message.setBaseUrl(this.restUrl());
  }

  /**
   *
   * @param url
   * @param method
   * @returns {Request}
   */
  r(url, method) {
    return this.methodFuns[method](url);
  }

  /**
   *
   * @param message
   * @returns {Promise}
   */
  send(message) {

    return new Promise((resolve, reject) => {

      this.createRequestFromMessage(message).end((err, res) => {
        if (err) {
          //minilog('apiconnect.rest').debug(err);
          reject(err, res);
        } else {
          resolve(res);
        }
      });

    });

  }

  createRequestFromMessage(message) {

    let url = message.baseUrl ? message.baseUrl + message.url : message.url;
    let request = this.r(url, message.method);

    if (this.withCredentials()) {
      request.withCredentials();
    }

    if (message.headers) {
      request.set(message.headers);
    }

    if (message.query) {
      //console.log(QS.stringify(message.query), message.query);
      //request.query(QS.stringify(message.query))
      request.query(message.query);
    }

    if (message.body) {
      request.send(message.body);
    }

    if (message.accept) {
      request.accept(message.accept);
    }

    if (message.multipart && message.multipart.files) {
      message.multipart.files.forEach((item) => {
        request.attach(item.field, item.path, item.filename);
      });
    }

    if (message.multipart && message.multipart.fields) {
      message.multipart.fields.forEach((item) => {
        request.field(item.name, item.value);
      });
    }

    return request;

  }

  getAuthHeader(token) {
    
    return {'Authorization': token.access.header};

  }

  sendWithToken(message) {

    return this.getToken(true).then(token => {

      let headers = Object.assign({}, message.headers, this.getAuthHeader(token));
      message.setHeaders(headers);
      return this.send(message);

    });


  }

  request(method, params) {

    let requestSuccess = (res) => {
      // TODO Wrap response to common interface
      //minilog('apiconnect.rest').debug('requestSuccess', res.req.path);
      return res;
    };


    let requestError = (err) => {

      // if got auth error, redispatch it
      let error = err;
      let request = JSON.stringify({method: method, params: params});
      
      if (error.name === AuthenticationFailedException.Name || error.name === AuthenticationTimeoutException.Name) {
        // do nothing
      } else if (error.status === 500) {
        // TODO handle errStr from headers
        error = ConnectException.create(err.status, err.message, err.response.body);
      }
      
      // TODO wrap 4xx to error
      
      error.request = request;

      throw error;

    };

    let message = this.createMessageForRequest(method, params);

    let pr = (!this.isRequestWithToken || this.isRequestWithToken(params.options)) ? this.sendWithToken(message) : this.send(message);

    return pr.then(requestSuccess).catch(requestError);

  }

  generateUrl(method, params) {

    let message = this.createMessageForRequest(method, params);
    let req = this.createRequestFromMessage(message);

    let query = req._query ? req._query.join('&') : '';

    let url = req.url;

    if (query) {
      url += (url.indexOf('?') >= 0 ? '&' : '?') + query;
    }

    return url;

  }

  createMessageForRequest(method, params) {


    let message = this.createMessage();

    if (!params.multipart && params.headers) {
      message.setHeaders(Object.assign({}, {'Content-Type': 'application/json'}, params.headers));
    } else if (!params.multipart) {
      message.setHeaders({'Content-Type': 'application/json'});
    }

    message.setMethod(method);

    let endPointSpec = [];

    if (params.endpoint) {
      endPointSpec = params.endpoint;
    } else {
      throw new Error('Missing endpoint spec or app id.');
    }

    if (params.objectId !== null) {
      endPointSpec.push(params.objectId);
    }

    if (params.action) {
      endPointSpec.push(params.action);
    }

    if (params.actionArg) {
      endPointSpec.push(params.actionArg);
    }

    message.setUrl(this.buildEndpoint(endPointSpec));

    if (params.queryParams) {
      message.setQuery(params.queryParams);
    }

    if (params.data) {
      message.setBody(params.data);
    }

    if (params.multipart) {
      message.setMultipart(params.multipart);
    }

    //minilog('apiconnect.rest').debug('message', message);

    return message;

  }

  buildEndpoint(endpoint) {

    if (!endpoint || endpoint.length < 2) {
      throw new Error('Invalid endpoint specification.');
    }

    return endpoint.join('/');

  }

}

