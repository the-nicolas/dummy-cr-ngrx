import {FluxConnect, Services, ApiConnectBase} from '../../src/browser';
import { dashDevCreds } from './credentials/dash-dev-creds';
import { processToken, DashboardMixin } from './common/dash-dev';
import { ConnectException } from '../../src/connect/net/exception';

describe('Delegate', () => {

  // console.log('ENV_API:', ENV_API);
  // console.log('ENV_APP:', ENV_APP);
  // console.log('ENV_NATS:', ENV_NATS);
  let originalTimeout;
  let client;

  beforeEach(async() => {
    
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    let creds = dashDevCreds;

    let app = ApiConnectBase.create({
      restUrl: ENV_APP || '',
      withCredentials: true,
    });

    let dashboard = app.addService(DashboardMixin);

    client = FluxConnect.create({
      natsEnabled: true,
      natsOpts: {
        url: ENV_NATS,
      },
      retrieveToken: () => {
        return dashboard.login(creds).then(processToken);
      }
    });
    
    client.setCredentials({});
    
    await client.open();

  });

  // only jest supports creating snapshot:
  if (jest) {
    it('', () => {
    });
  }
  
  it('should execute delegate manager static methods', async() => {
  
    let dummyMan = client.getService(Services.DummyManager);
    
    // execute not existing method
    let err = await dummyMan.methodCall('undefined', 'msg').catch(_err => _err);
    expect(err.message).toEqual('timeout');

    let msg = 'test message';

    let res = await dummyMan.ping(msg);
    expect(res).toEqual(msg);

    // should execute at least 5 sec, uses request ttl update
    let t1 = performance.now();
    res = await dummyMan.pingLong('ttl');
    let t2 = performance.now();
    expect(res).toEqual('ttl');
    expect(t2 - t1).toBeGreaterThan(5 * 1000);

  });

  it('should create dummy delegate and execute delegate methods', async() => {

    let dummyMan = client.getService(Services.DummyManager);
    let ecrDummy = await dummyMan.connect('testUUID');
    expect(ecrDummy.delegateId).toContain('testUUID');

    let msg = 'test delegate message';

    let res = await ecrDummy.ping(msg);
    expect(res).toEqual(msg);

    let err = await ecrDummy.createTransaction({data: 2}).catch(_err => _err);
    expect(err.name).toEqual('ConnectException');
    expect(err.status).toEqual(500);

    let tx = {data: 'client data'};
    let txProxy = await ecrDummy.createTransaction(tx);
    expect(txProxy.data.data).toEqual(tx.data);

    res = await ecrDummy.disconnect();
    expect(res).toEqual(true);

  });

  it('should send, retrieve and reply to dummy delegate notifications', async() => {

    let dummyMan = client.getService(Services.DummyManager);
    let ecrDummy = await dummyMan.connect('testUUID');
    expect(ecrDummy.delegateId).toContain('testUUID');
    
    let notifySpy = jasmine.createSpy('notifySpy');

    let notifyCb;
    let notifyPromise = new Promise((resolve) => {
      notifyCb = resolve;
    });

    ecrDummy.on('notify.dummy', (msg, replyFunc, ttlFunc) => {
      // console.log('notify.dummy', msg, replyFunc, ttlFunc);
      notifySpy('notify.dummy', msg, replyFunc, ttlFunc);
      notifyCb(true);
    });

    ecrDummy.on('notify.dummy.ack', (msg, replyFunc, ttlFunc) => {
      ttlFunc(2000);
      setTimeout(replyFunc, 1500, {});
    });

    ecrDummy.on('notify.dummy.reply', (msg, replyFunc, ttlFunc) => {
      ttlFunc(2000);
      setTimeout(replyFunc, 1500, {Reply: msg.Msg});
    });

    let res = await ecrDummy.notify('dummy', 'test');
    expect(res).toEqual({});

    res = await notifyPromise;
    expect(res).toEqual(true);
    expect(notifySpy.calls.mostRecent().args[0]).toEqual('notify.dummy');
    expect(notifySpy.calls.mostRecent().args[1]).toEqual({Type: 'dummy', Msg: 'test'});

    res = await ecrDummy.notifyAck('dummy.ack', 'test-ack', 1000);
    expect(res).toEqual({});

    res = await ecrDummy.notifyReply('dummy.reply', 'test-reply', 1000);
    expect(res).toEqual({Reply: 'test-reply'});

    res = await ecrDummy.disconnect();
    expect(res).toEqual(true);

  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
