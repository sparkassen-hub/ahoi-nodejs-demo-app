import { error } from 'console';

import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { RegistrationApi, RegistrationResponse } from 'ahoi-swagger-fetchclient';
import { MongoDbHelper } from 'appservice-base';

import { AhoiUser, AhoiUserModel } from '../models/ahoiuser';
import { AhoiUserService } from './ahoiuserservice';

export class AhoiBaseUserService implements AhoiUserService {

  constructor(private ahoiApi: AhoiApiFactory) { }

  public async getInstallationId(userid: string): Promise<string> {
    if (!userid) {
      throw new Error('Unable to fetch data for unknow user');
    }

    try {
      const ahoiuser: AhoiUser = await MongoDbHelper.findByRefId<AhoiUser>(userid, AhoiUserModel);
      if (ahoiuser && ahoiuser.getInstallationId()) {
        return ahoiuser.getInstallationId();
      }

      const api: RegistrationApi = await this.ahoiApi.getRegistrationApi();
      const installationid: RegistrationResponse = await api.register();
      if (!installationid || !installationid.installation) {
        throw new Error('An error occured during the communication with AHOI service');
      }

      const ahoiusermodel = {
        installationid: installationid.installation,
        refid: userid,
      };
      await (await AhoiUserModel.create(ahoiusermodel)).save();

      return installationid.installation;
    } catch (e) {
      error(e);
      throw new Error('An error occured during the communication with AHOI service');
    }
  }

}
