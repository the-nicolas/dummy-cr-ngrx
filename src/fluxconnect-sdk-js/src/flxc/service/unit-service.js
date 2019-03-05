import {ApiExecService} from '../../connect/api/api-exec-service';

export class UnitService extends ApiExecService {

  constructor() {
    super();
  }
  
  subs(id) {
    return this.retrieveWithAction(id, 'subs');
  }
  
  services(id) {
    return this.retrieveWithAction(id, 'services');
  }
  
  devices(id) {
    return this.retrieveWithAction(id, 'devices');
  }

  addService(data) {
    return this.execute('addservice', null, null, data);
  }

  removeService(data) {
    return this.execute('removeservice', null, null, data);
  }

  getEndpoint() {
    return ['unit'];
  }

  getEventTargets() {
    return [];
  }
  
}

UnitService.Uid = (['api', 'v1', 'unit']).join('.');
