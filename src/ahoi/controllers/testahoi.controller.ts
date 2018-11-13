import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { Token } from 'ahoi-nodejs-client/dist/ahoi/auth/token';
import { RegistrationApi, RegistrationResponse } from 'ahoi-swagger-fetchclient';
import { GET, ROUTE, QUERYPARAM, Validator_Required } from 'appservice-base';

@ROUTE('/ahoi')
export class TestAhoiController {

  constructor(private ahoiApi: AhoiApiFactory) { }

  @GET('/testahoi')
  public async doAhoiTest(): Promise<Token> {
    const token: Token = await this.ahoiApi.getAhoiUtil().getClientAuthToken();
    return token;
  }

  @GET('/installationid')
  public async getInstallationId(): Promise<RegistrationResponse> {
    const api: RegistrationApi = await this.ahoiApi.getRegistrationApi();
    return api.register();
  }

  @GET('/delete')
  public async deleteInstallationId(
    @QUERYPARAM('installationid', Validator_Required) installationid: string): Promise<Response> {
    const api: RegistrationApi = await this.ahoiApi.getRegistrationApi();
    return api.deleteRegistration();
  }

}
