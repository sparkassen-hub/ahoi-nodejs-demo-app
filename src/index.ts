import { AhoiApiFactory, AhoiConfig } from 'ahoi-nodejs-client';
import {
  Configuration,
  Environment,
  ServerApplication,
} from 'appservice-base';

import { AccessController } from './ahoi/controllers/access.controller';
import { AccountsController } from './ahoi/controllers/accounts.controller';
import { ProvidersController } from './ahoi/controllers/providers.controller';
import { TestAhoiController } from './ahoi/controllers/testahoi.controller';
import { TransactionsController } from './ahoi/controllers/transactions.controller';
import { AhoiBaseUserService } from './ahoi/services/ahoibaseuserservice';
import { AhoiTestUserService } from './ahoi/services/ahoitestuserservice';
import { AhoiUserService } from './ahoi/services/ahoiuserservice';
import { HelloWorldController } from './helloworld/controllers/helloworld.controller';
import { HelloWorldStrategy } from './helloworld/passport/helloworldstrategy';

const app: ServerApplication = new ServerApplication();

/*

  Configure server

  The server may be initialized with urls cors requests are allowed for as third parameter.
  For security reasons these should be set in production environment.

  Example:
  const server = app.getServer(port, env, [`http://myserver:${port}`, 'http://otherserver:8100']);

*/
const server = app.getServer();

/*

  Authentication, Login and Registration

*/
// const jwtService = new JwtService(Configuration.get('AUTH_JWT_PRIVATE_KEY'),
//                                   Configuration.get('AUTH_JWT_PUBLIC_KEY'));

// Note: if ENABLE_AUTHENTICATION is set to false in configuration this authenticator is beeing
// ignored
// path to protect, passport strategy, paths to except from auth check
// server.addPassportStrategy('/ahoi', new LocalJwtStrategy(jwtService, ['/testahoi', '/installationid']));
app.addAuthentication({ path: '/ahoi', excludes: ['/testahoi', '/installationid'] });

/*

  AHOI services and controllers

*/
const ahoiConfig: AhoiConfig = {
  clientId: Configuration.get('AHOI_CLIENTID'),
  clientSecret: Configuration.get('AHOI_CLIENTSECRET'),
  appSecretIv: Configuration.get('AHOI_APPSECRETIV'),
  appSecretKey: Configuration.get('AHOI_APPSECRETKEY'),
  baseurl: Configuration.get('AHOI_BASEURL'),
  cryptKey: Configuration.get('AHOI_CRYPTKEY'),
};

const ahoiApi = new AhoiApiFactory(ahoiConfig);

let ahoiUserService: AhoiUserService;
if (!Configuration.getBoolean('ENABLE_AUTHENTICATION')) {
  ahoiUserService = new AhoiTestUserService(ahoiApi);
} else {
  ahoiUserService = new AhoiBaseUserService(ahoiApi);
}

server.addController(new ProvidersController(ahoiApi, ahoiUserService));
server.addController(new AccessController(ahoiApi, ahoiUserService));
server.addController(new AccountsController(ahoiApi, ahoiUserService));
server.addController(new TransactionsController(ahoiApi, ahoiUserService));

if (Configuration.getEnvironment() === Environment.Development) {
  server.addController(new TestAhoiController(ahoiApi));
}

/*

  Tutorial

*/
// Set explicitly the server that are allowed to deliver external content like Scripts.
// To make development easier, you can disable Content Security Policy completely. For production
// this is not recommended.
// server.disableContentSecurityPolicy();
// For Angular applications or jQuery based applications the parameter 'allowInsecureContent' must
// be true, as inline scripts and inline styles must be allowed
server.addStaticFiles('./tutorial', '/', 'transactions.html', true, {
  defaultSrc: ["'self'"],
  // scriptSrc: ["'self'", 'code.jquery.com'],
  styleSrc: ["'self'", 'https://cdnjs.cloudflare.com', 'https://use.fontawesome.com'],
  fontSrc: ["'self'", 'https://use.fontawesome.com', 'data:'],
  imgSrc: ["'self'", 'data:'],
});
// server.use('/hello/bell', async (request, response) => response.type('text/html').send('Hello World1'));

/*

  'Hello World' services and controllers

*/
// if (env === Environment.Development) {
server.addPassportStrategy('/helloauth', new HelloWorldStrategy());
server.addController(new HelloWorldController('World'));
// }

/*

  Start the server

*/
app.start();
