import {ApiExecService} from '../../connect/api/api-exec-service';

export class TransactionService extends ApiExecService {

  constructor() {
    super();
  }

  getEndpoint() {
    return ['transaction', 'manage'];
  }

  getEventTargets() {
    return [];
  }

}

TransactionService.Uid = (['api', 'v1', 'transaction', 'manage']).join('.');
