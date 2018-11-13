import { AbstractStrategy, AuthenticationResult } from 'appservice-base';
import { Request } from 'express';

export class HelloWorldStrategy extends AbstractStrategy {

  public static readonly STRATEGYNAME: string = 'helloworld';

  protected getStrategyName(): string {
    return HelloWorldStrategy.STRATEGYNAME;
  }

  protected async authenticateRequest(request: Request, options?: any): Promise<AuthenticationResult> {
    if (request.query['secret'] === 'helloworld') {
      return { user: { firstname: 'hello', lastname: 'world' } };
    }
    throw new Error('Hello Unauthorized');
  }

}
