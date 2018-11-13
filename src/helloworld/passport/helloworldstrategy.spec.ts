import { HelloWorldStrategy } from './helloworldstrategy';
import { mockReq } from 'sinon-express-mock';

describe('HelloWorldStrategy', () => {
  let helloWorldStrategy: HelloWorldStrategy;

  beforeEach(() => {
    helloWorldStrategy = new HelloWorldStrategy();
  });

  test('should return the strategy name', () => {
    expect('helloworld').toBe(HelloWorldStrategy.STRATEGYNAME);
  });

  test('should authenticate the request', async () => {
    const request = {
      path: '',
      query: {
        secret: 'helloworld',
      },
    };
    const req = mockReq(request);
    const auth = await helloWorldStrategy['authenticateRequest'](req, {});

    expect(auth).toEqual({
      user: {
        firstname: 'hello',
        lastname: 'world',
      },
    });
  });

});
