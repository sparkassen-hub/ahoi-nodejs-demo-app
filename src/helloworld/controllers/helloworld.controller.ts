import {
  Validator_EmailRequired,
  GET,
  PATHPARAM,
  QUERYPARAM,
  REQUEST,
  RESPONSE,
  ROUTE,
  Validator_Required,
  Validators,
} from 'appservice-base';
import { Request, Response } from 'express';
import { check, oneOf } from 'express-validator/check';

@ROUTE('/hello')
export class HelloWorldController {

  constructor(private defaultWhat: string) { }

  @GET('/world')
  public getHelloWorld(): string {
    return 'Hello World';
  }

  @GET('/json')
  public getHelloJson(): any {
    return { Hello: 'JSON' };
  }

  @GET('/name/:what')
  public getHelloWhat(@PATHPARAM('what') what: string): string {
    return `Hello ${what}`;
  }

  @GET('/param')
  public getHelloParam(@QUERYPARAM('what') what: string): string {
    const myWhat = what || this.defaultWhat;
    return `Hello ${myWhat}`;
  }

  @GET('/simplevalidation')
  public getHelloSimpleValidation(@QUERYPARAM('what', Validator_EmailRequired) what: string): any {
    // return `Hello ${what}`;
    return { response: `Hello ${what}` };
  }

  @GET('/extendedvalidation')
  public getHelloExtendedValidation(@QUERYPARAM('what', {
    required: true,
    message: 'Parameter \'what\' must be a valid email address',
    type: Validators.Email,
  }) what: string): string {
    return `Hello ${what}`;
  }

  @GET('/advancedvalidation', {
    validation: [oneOf([
      check('what').not().isEmpty(),
      check('location').not().isEmpty(),
    ],                 'At least one of these query parameters must be set: "what", "location"')],
  })
  public getHelloAdvancedValidation(@QUERYPARAM('what') what: string,
                                    @QUERYPARAM('location') location: string): string {
    return `Hello ${what || 'you'} in ${location || 'nowhere'}`;
  }

  /**
   * Call it with param 'secret' and value 'helloworld'. Otherwise you should get status
   * 'Unauthorized'
   *
   * @example
   * ```
   * http://localhost:3000/?secret=helloworld
   * ```
   *
   * @param {string} secret
   * @returns {string}
   * @memberof HelloWorldController
   */
  @GET('/auth')
  public getHelloAuth(@QUERYPARAM('secret', Validator_Required) secret: string): string {
    return 'Hello authenticated';
  }

  @GET('/')
  public getHelloAdvanced(@REQUEST() request: Request,
                          @RESPONSE() response: Response): void {
    const what = request.query.what;
    response.status(200);
    response.send(`Hello ${what}`);
  }

  @GET('/error', { success: 200, error: 500, type: 'application/json' })
  public getHelloError(): string {
    throw ('Calling hello <script>alert(34)</script> with error');
  }

  @GET('/promise')
  public getHelloPromise(): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => { resolve('Hello Promise'); }, 3000);
    });
  }

  @GET('/await')
  public async getHelloAsync(): Promise<string> {
    const response = await this.fetchAnswer('Await');
    return response;
  }

  private fetchAnswer(what: string): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => { resolve(`Hello ${what}`); }, 3000);
    });
  }

}
