import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { Provider, ProviderApi } from 'ahoi-swagger-fetchclient';
import {
  GET,
  PATHPARAM,
  QUERYPARAM,
  ROUTE,
  USER,
  Validator_Bool,
  Validator_NotEmpty,
  Validator_Numeric,
  Validator_UUIDRequired,
} from 'appservice-base';

import { MOCK_PROVIDER } from '../mockprovider';
import { AhoiUserService } from '../services/ahoiuserservice';

@ROUTE('/ahoi')
export class ProvidersController {

  constructor(private ahoiApi: AhoiApiFactory, private userService: AhoiUserService) { }

  @GET('/providers')
  public async getProviders(@USER() user: any,
                            @QUERYPARAM('bankCode', Validator_Numeric) bankCode?: string,
                            @QUERYPARAM('supported', Validator_Bool) supported: boolean = true,
                            @QUERYPARAM('query', Validator_NotEmpty) query?: string): Promise<Provider[]> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: ProviderApi = await this.ahoiApi.getProviderApi(installationId);
    return api.getProviders(bankCode, supported, query);
    // const providers: Provider[] = await api.getProviders(bankCode, supported, query);
    // return [...providers, ...MOCK_PROVIDER];
  }

  @GET('/providers/:providerid')
  public async getProvider(@USER() user: any,
                           @PATHPARAM('providerid', Validator_UUIDRequired) providerId: string): Promise<Provider> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: ProviderApi = await this.ahoiApi.getProviderApi(installationId);
    return api.getProvider(providerId);
  }

}
