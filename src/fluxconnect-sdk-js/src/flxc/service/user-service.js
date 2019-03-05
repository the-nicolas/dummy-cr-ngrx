import {ApiExecService} from '../../connect/api/api-exec-service';

export class UserService extends ApiExecService {

  constructor() {
    super();
  }
  
  getEndpoint() {
    return ['user'];
  }

  getEventTargets() {
    return [];
  }
  
}

UserService.Uid = (['api', 'v1', 'user']).join('.');
