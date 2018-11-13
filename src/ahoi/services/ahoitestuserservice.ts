import * as fs from 'fs';

import { RegistrationApi } from 'ahoi-swagger-fetchclient';
import { AhoiApiFactory } from 'ahoi-nodejs-client';

import { Configuration } from 'appservice-base';
import { AhoiUserService } from './ahoiuserservice';
import { debug } from 'console';

export class AhoiTestUserService implements AhoiUserService {

  private installationid!: string;

  constructor(private ahoiApi: AhoiApiFactory) { }

  public async getInstallationId(userid: string): Promise<string> {
    // ENABLE_AUTHENTICATION is set to false in configuration
    if (!this.installationid) {
      let stored: any = fs.existsSync('installationid') ? fs.readFileSync('installationid').toString() : null;
      stored = stored ? JSON.parse(stored) : {};
      if (stored && stored.installationid && stored.ahoiaccount === Configuration.get('AHOI_CLIENTID')) {
        this.installationid = stored.installationid;
      } else {
        const api: RegistrationApi = await this.ahoiApi.getRegistrationApi();
        this.installationid = (await api.register()).installation || '';
        const id = { ahoiaccount: Configuration.get('AHOI_CLIENTID'), installationid: this.installationid };
        fs.writeFile('installationid', JSON.stringify(id), (err) => {
          if (err) {
            debug('InstallationId could not be saved for reuse on disc!');
          }
        });
      }
    }
    return this.installationid;
  }

}
