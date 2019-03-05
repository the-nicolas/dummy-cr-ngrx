import {Client} from './connect/client';
export {Channel} from './connect/net/channel';
export {Token} from './connect/auth/token';

import {ClientBrowserEnvironment} from './flxc/client-browser-environment';
export {ServiceMap as Services} from './flxc/client-browser-environment';
export {ApiConnectBase} from './api-connect-base';

//import minilog from 'minilog';
//export const MiniLog = minilog;
//minilog.suggest.deny(/flux\..*/, 'warn');


export const FluxConnect = {
  description: 'Api for browser'
};

FluxConnect.create = (config) => {

  return Client.create(config, ClientBrowserEnvironment);

};
