import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { Access, AccessApi } from 'ahoi-swagger-fetchclient';
import {
  GET,
  PATHPARAM,
  POST,
  QUERYPARAM,
  ROUTE,
  USER,
  Validator_NotEmpty,
  Validator_Required,
  Validator_UUIDRequired,
} from 'appservice-base';

import { AhoiUserService } from '../services/ahoiuserservice';

@ROUTE('/ahoi')
export class AccessController {

  constructor(private ahoiApi: AhoiApiFactory, private userService: AhoiUserService) { }

  @GET('/accesses')
  public async getAccesses(@USER() user: any): Promise<Access[]> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccessApi = await this.ahoiApi.getAccessApi(installationId);
    return api.getAccesses();
  }

  @GET('/accesses/:accessid')
  public async getAccesse(@USER() user: any,
                          @PATHPARAM('accessid', Validator_UUIDRequired) accessId: string): Promise<Access> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccessApi = await this.ahoiApi.getAccessApi(installationId);
    return api.getAccess(accessId);
  }

  @POST('/accesses')
  public async postAccess(@USER() user: any,
                          @QUERYPARAM('providerid', Validator_UUIDRequired) providerId: string,
                          @QUERYPARAM('pin', Validator_Required) pin: string,
                          @QUERYPARAM('username', Validator_NotEmpty) username: string,
                          @QUERYPARAM('customernumber', Validator_NotEmpty) customernumber?: string): Promise<Access> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: AccessApi = await this.ahoiApi.getAccessApi(installationId);
    const access: Access = {
      providerId,
      type: 'BankAccess',
      accessFields: {
        USERNAME: username,
        CUSTOMERNUMBER: customernumber,
        PIN: pin,
      },
    };
    return api.postAccess(access);
  }

}
