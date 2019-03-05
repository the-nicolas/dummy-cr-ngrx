import {ApiExecService} from '../../connect/api/api-exec-service';

export class DeviceService extends ApiExecService {

  constructor() {
    super();
  }
  
  services(id) {
    return this.retrieveWithAction(id, 'services');
  }

  enableService(data) {
    return this.execute('enableservice', null, null, data);
  }

  disableService(data) {
    return this.execute('disableservice', null, null, data);
  }

  getEndpoint() {
    return ['device', 'manage'];
  }

  getEventTargets() {
    return [];
  }
  
}

DeviceService.Uid = (['api', 'v1', 'device', 'manage']).join('.');
