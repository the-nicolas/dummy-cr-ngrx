import {FluxConnect, ApiConnectBase} from '../../src/browser';
import { dashDevCreds } from './credentials/dash-dev-creds';
import { processToken, DashboardMixin } from './common/dash-dev';

describe('Init', () => {

  // console.log('ENV_API:', ENV_API);
  // console.log('ENV_APP:', ENV_APP);
  // console.log('ENV_NATS:', ENV_NATS);

  beforeEach(async() => {
    await Promise.resolve();
  });

  // only jest supports creating snapshot:
  if (jest) {
    it('', () => {
    });
  }

  it('should init with default config, not authorized', async() => {
    
    let app = ApiConnectBase.create({});
    expect(app).toHaveProperty('addService');
    
    expect(FluxConnect).toHaveProperty('create');
    let client = FluxConnect.create({});
    expect(client).toHaveProperty('setCredentials');
    expect(client).toHaveProperty('getService');

    client.setCredentials({});
    let res = await client.open();
    expect(res).toEqual(true);

    let err = await client.context.getAuth().getToken().catch(_err => _err);
    expect(err.name).toEqual('AuthenticationFailedException');
    expect(err.message).toEqual('Cannot retrieve token: retrieveToken is not defined');
  });

  it('should set dummy token via setCredentials()', async() => {
    
    let client = FluxConnect.create({});
    
    let tokStr = 'ncgbclsdmcalsmbdlxa';
    let tokenHeader = `Bearer ${tokStr}`;

    let token = {access: {header: tokenHeader, token: tokStr}};
    client.setCredentials({token: token});
    
    let res = await client.open();
    expect(res).toEqual(true);

    let receivedToken = await client.context.getAuth().getToken();
    expect(receivedToken).toEqual(token);

    // TODO handle token expiration

  });


  it('should set dummy token via retrieveToken callback', async() => {
    
    let tokStr = 'ncgbclsdmcalsmbdlxa';
    let tokenHeader = `Bearer ${tokStr}`;

    let token = {access: {header: tokenHeader, token: tokStr}};

    let client = FluxConnect.create({
      retrieveToken: () => {
        return Promise.resolve(token);
      }
    });
    
    // {token: {access: {header: tokenHeader+'1', token: tokStr+'1'}}}
    client.setCredentials({});
    
    let res = await client.open();
    expect(res).toEqual(true);

    let receivedToken = await client.context.getAuth().getToken();
    expect(receivedToken).toEqual(token);

    // TODO handle token expiration

  });

  it('should prefer dummy token set via setCredentials() to retrieveToken callback', async() => {
    
    let tokStr = 'ncgbclsdmcalsmbdlxa';
    let tokenHeader = `Bearer ${tokStr}`;

    let _token = {access: {header: tokenHeader, token: tokStr}};

    let client = FluxConnect.create({
      retrieveToken: () => {
        return Promise.resolve(_token);
      }
    });
    
    let token = {access: {header: tokenHeader + '1', token: tokStr + '1'}};
    client.setCredentials({token: token});
    
    let res = await client.open();
    expect(res).toEqual(true);

    let receivedToken = await client.context.getAuth().getToken();
    expect(receivedToken).toEqual(token);

    // TODO handle token expiration

  });

  it('should get dashboard token via retrieveToken callback using login/pasword credentials', async() => {

    let creds = dashDevCreds;

    let app = ApiConnectBase.create({
      restUrl: ENV_APP || '',
      withCredentials: true
    });

    let dashboard = app.addService(DashboardMixin);

    let client = FluxConnect.create({
      retrieveToken: () => {
        return dashboard.login(creds).then(processToken);
      }
    });
    
    client.setCredentials({});
    
    let res = await client.open();
    expect(res).toEqual(true);

    let receivedToken = await client.context.getAuth().getToken();
    
    expect(receivedToken).toBeDefined();

    // TODO handle token expiration

  });

  afterEach(() => {

  });
});
