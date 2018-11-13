import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { Account, AccountApi } from 'ahoi-swagger-fetchclient';
import { DELETE, GET, QUERYPARAM, ROUTE, USER, Validator_UUIDRequired } from 'appservice-base';

import { AhoiUserService } from '../services/ahoiuserservice';

@ROUTE('/ahoi')
export class AccountsController {

  constructor(private ahoiApi: AhoiApiFactory, private userService: AhoiUserService) { }

  @GET('/accounts')
  public async getAccounts(@USER() user: any,
                           @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string): Promise<Account[]> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccountApi = await this.ahoiApi.getAccountApi(installationId);
    return api.getAccounts(accessid);
  }

  @GET('/account')
  public async getAccount(@USER() user: any,
                          @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string,
                          @QUERYPARAM('accountid', Validator_UUIDRequired) accountid: string): Promise<Account> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccountApi = await this.ahoiApi.getAccountApi(installationId);
    return api.getAccount(accessid, accountid);
  }

  // TODO: return value should be Response
  @DELETE('/accounts/delete')
  public async deleteAccount(@USER() user: any,
                             @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string,
                             @QUERYPARAM('accountid', Validator_UUIDRequired) accountid: string): Promise<any> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccountApi = await this.ahoiApi.getAccountApi(installationId);
    return api.deleteAccount(accessid, accountid);
  }

}
