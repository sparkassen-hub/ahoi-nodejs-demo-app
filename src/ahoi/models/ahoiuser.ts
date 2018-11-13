import { Typegoose, instanceMethod, prop } from 'appservice-base';

// @pre<any & MongooseDocument>('save', async function (next: () => void) { await this.beforeSave(this); next(); })
export class AhoiUser extends Typegoose {

  @prop({ index: true })
  private ids!: any;

  @prop({ required: true })
  private installationid!: string;

  /**
   * User id {@link AuthUser}
   *
   * @private
   * @type {string}
   * @memberof AhoiUser
   */
  @prop()
  private refid!: string;

  /**
   * Returns the AHOI installationid for this user.
   *
   * @returns
   * @memberof AhoiUser
   */
  @instanceMethod
  public getInstallationId() {
    return this.installationid;
  }

  // @instanceMethod
  // private async beforeSave(model: any & MongooseDocument): Promise<void> {
  //   // prepare or change values before saving if needed
  // }

}

// tslint:disable-next-line:variable-name
export const AhoiUserModel = new AhoiUser().getModelForClass(AhoiUser);
