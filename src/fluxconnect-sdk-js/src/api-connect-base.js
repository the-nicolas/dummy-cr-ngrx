import {Client} from './connect/client';
export {Channel} from './connect/net/channel';
import {TokenStorageInMem} from './connect/auth/token-storage';


export const ApiConnectBase = {
  description: 'Api base client for browser'
};

const BaseEnvironment = {
  config: {},
  services: []
};

BaseEnvironment.TokenStorage = {
  create: () => {
    return new TokenStorageInMem();
  }
};

ApiConnectBase.create = (config) => {
  
  return Client.create(config, BaseEnvironment);

};
