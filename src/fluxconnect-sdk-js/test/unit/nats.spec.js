import {FluxConnect, ApiConnectBase} from '../../src/browser';
import { dashDevCreds } from './credentials/dash-dev-creds';
import { processToken, DashboardMixin } from './common/dash-dev';

describe('Nats channel', () => {

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

  it('should fail to open nats channel', async() => {

    let creds = dashDevCreds;

    let app = ApiConnectBase.create({
      restUrl: ENV_APP || '',
      withCredentials: true,
    });

    let dashboard = app.addService(DashboardMixin);

    let client = FluxConnect.create({
      natsEnabled: true,
      retrieveToken: () => {
        return dashboard.login(creds).then(processToken);
      }
    });
    
    client.setCredentials({});
    
    let err = await client.open().catch(_err => _err);
    expect(err.message).toContain('Invalid nats url');

    let res = await client.close();
    expect(res).toEqual(false);

  });

  it('should open nats channel', async() => {

    let creds = dashDevCreds;

    let app = ApiConnectBase.create({
      restUrl: ENV_APP || '',
      withCredentials: true,
    });

    let dashboard = app.addService(DashboardMixin);

    let client = FluxConnect.create({
      natsEnabled: true,
      natsOpts: {
        url: ENV_NATS,
      },
      retrieveToken: () => {
        return dashboard.login(creds).then(processToken);
      }
    });
    
    client.setCredentials({});
    
    let res = await client.open();
    expect(res).toEqual(true);

    res = await client.close();
    expect(res).toEqual(false);

  });

  afterEach(() => {

  });
});
