import nuid from 'nuid';
import { Nats } from '../connect/net/nats';
import { TokenStorageInMem } from '../connect/auth/token-storage';
import NatsImpl from 'websocket-nats';

import { UserService } from './service/user-service';
import { DeviceService } from './service/device-service';
import { ServiceService } from './service/service-service';
import { TransactionService } from './service/transaction-service';
import { UnitService } from './service/unit-service';
import { EcrManager } from './delegate/ecr';
import { DummyManager } from './delegate/dummy';

export const ClientBrowserEnvironment = {
  config: {},
  services: [
    UserService,
    DeviceService,
    ServiceService,
    TransactionService,
    UnitService,
    DummyManager,
    EcrManager
  ]
};

ClientBrowserEnvironment.NatsChannel = {
  create: () => {
    return new Nats(NatsImpl);
  }
};

ClientBrowserEnvironment.TokenStorage = {
  create: () => {
    return new TokenStorageInMem();
  }
};

ClientBrowserEnvironment.randomUUID = function() {
  return nuid.next();
};

export const ServiceMap = {
  Users: UserService.Uid,
  Devices: DeviceService.Uid,
  Services: ServiceService.Uid,
  Transactions: TransactionService.Uid,
  Units: UnitService.Uid,
  DummyManager: DummyManager.Uid,
  EcrManager: EcrManager.Uid,
};
