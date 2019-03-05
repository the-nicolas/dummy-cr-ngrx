import { ApiService } from './api-service';
import {Channel} from '../net/channel';
import mixins from '../util/mixins';

export class ApiExecService extends ApiService {

  constructor() {
    super();
  }

  /**
   * Retrieves a promise for a single object (resource) of a given type, never null<br/>
   * Would invoke for example: POST /targetType/get with body {id: id}.<br/>
   * An exception is thrown if the id is unknown.
   * @param id
   * @param options
   * @return {Promise}
   */
  retrieve(id, queryParams, options) {
    
    let params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: 'get',
      data: {id: id},
      queryParams: queryParams
    };

    return this._request(Channel.METHOD.EXECUTE, params, options);
  }

  /**
   * Retrieves a promise for a single object (resource) of a given type, never null<br/>
   * Would invoke for example: POST /targetType/get{action} with body {id: id}.<br/>
   * An exception is thrown if the id is unknown.
   * @param id
   * @param action
   * @return {Promise}
   */
  retrieveWithAction(id, action, queryParams, options) {

    let params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: `get${action}`,
      data: {id: id},
      queryParams: queryParams
    };

    return this._request(Channel.METHOD.EXECUTE, params, options);

  }

  /**
   * Retrieves a promise for a collection of objects (resources) of a given type according to a given query.<br/>
   * Would invoke for example: GET /targetType?queryParams.<br/>
   * May throw an exception if an error happens.
   *
   * @param queryParams    The query parameter data.
   * @param options        will be used to determine actual target destination.
   * @return {Promise}
   */
  retrieveList(queryParams, options) {

    let params = {
      endpoint: this.getEndpointPrefix().concat(this.getEndpoint()),
      objectId: null,
      action: 'list',
      data: queryParams
    };

    return this._request(Channel.METHOD.EXECUTE, params, options);

  }

}

ApiExecService.createWithMixin = (ServiceMixin) => {

  let Mixed = mixins(ApiExecService, ServiceMixin);
  return new Mixed();

};
