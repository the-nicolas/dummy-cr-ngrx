import {ApiService} from '../../connect/api/api-service';

export class ServiceService extends ApiService {

  constructor() {
    super();
  }
  
  getEndpoint() {
    return ['services'];
  }

  getEventTargets() {
    return [];
  }
  
}

ServiceService.Uid = (['api', 'v1', 'services']).join('.');
