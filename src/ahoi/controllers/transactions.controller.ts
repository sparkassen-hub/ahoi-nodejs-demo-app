import { AhoiApiFactory } from 'ahoi-nodejs-client';
import { MonthlySummary, Transaction, TransactionApi, TransactionSummaryApi } from 'ahoi-swagger-fetchclient';
import {
  GET,
  Validator_ISO8601,
  Validator_Numeric,
  QUERYPARAM,
  ROUTE,
  USER,
  Validator_UUIDRequired,
} from 'appservice-base';

import { AhoiUserService } from '../services/ahoiuserservice';

@ROUTE('/ahoi')
export class TransactionsController {

  constructor(private ahoiApi: AhoiApiFactory, private userService: AhoiUserService) { }

  /**
   * Get account transactions. The order is from latest to oldest transactions. If no constraint
   * parameter is given, e.g. limit, all transactions are returned. Due to performance reasons it is
   * not recommended to fetch all transactions at once.
   *
   * It dependends on the specific bank how many days in the past the transactions can requested.
   *
   * @example
   * Example with paging, fetch transactions from 1. Jan to 31. March with max. 10 entries. The next
   * call fetches also max. 10 entries but starts not with the first but with the 11. item.
   * /transactions?from=2018-01-01T00:00:00Z&to=2018-03-31T23:59:59Z&limit=10
   * /transactions?from=2018-01-01T00:00:00Z&to=2018-03-31T23:59:59Z&limit=10&offset=10
   *
   * @param {*} user An authenticated user object.
   * @param {string} accessid The accessid that can be taken e.g. from
   * {@link AccessController.getAccesses()}. The accessid is bound to a granted bank access.
   * @param {string} accountid This is the id for a certain bank account, means a bank account you
   * have at the bank the accessid relates to.
   * @param {number} [maxage] Specify the time in seconds how old the oldest transactions may be.
   * AHOI does not fetch new transactions from given bank immediately. So it may be, the stored data
   * is older than you want it to be. If the transactions AHOI has already fetched not enough up to
   * date, AHOI will fetch newer transaction data. If you give 0 as maxage, AHOI will fetch
   * transactions from given bank in any case.
   * @param {number} [limit] The maximum number of transactions to be returned.
   * @param {number} [offset] The start index e.g. start not with the first transaction but skip the
   * first 100. This can be used if you want
   * @param {string} [from] The start date for transactions. The given date must be in ISO8601
   * format (e.g. 1970-01-01T00:00:00Z). With JavaScript use Date.getUTCDate()
   * @param {string} [to] The end date for transactions. The given date must be in ISO8601 format
   * (e.g. 1970-01-01T00:00:00Z). With JavaScript use Date.toISOString()
   * @returns {Promise<Asset[]>}
   * @memberof TransactionController
   */
  @GET('/transactions')
  public async getTransactions(@USER() user: any,
                               @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string,
                               @QUERYPARAM('accountid', Validator_UUIDRequired) accountid: string,
                               @QUERYPARAM('maxage', Validator_Numeric) maxage?: number,
                               @QUERYPARAM('limit', Validator_Numeric) limit?: number,
                               @QUERYPARAM('offset', Validator_Numeric) offset?: number,
                               @QUERYPARAM('from', Validator_ISO8601) from?: string,
                               @QUERYPARAM('to', Validator_ISO8601) to?: string): Promise<Transaction[]> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: TransactionApi = await this.ahoiApi.getTransactionApi(installationId);
    return api.listTransactions(accessid, accountid, maxage, limit, offset, from, to);
  }

  /**
   * Returns transactions for full months. With parameter {@link numberofmonth} can be set for how
   * many number of months transactions may be returned. Default is only for the current month (1).
   * With the parameter {@link startmonthyear} the month and year to start from can be set.
   *
   * @param {*} user
   * @param {string} accessid
   * @param {string} accountid
   * @param {number} [count=1] Number of months for which transactions may be returned
   * @param {number} [startmonthyear] Number of months to skip starting from current month (1 = no
   * transactions from current month,  month, 2 = no transactions from current and provious month...)
   * @returns {Promise<Transaction[]>}
   * @memberof TransactionController
   */
  @GET('/transactionsmonthly')
  public async getTransactionsForMonth(@USER() user: any,
                                       @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string,
                                       @QUERYPARAM('accountid', Validator_UUIDRequired) accountid: string,
                                       @QUERYPARAM('count', Validator_Numeric) count: number = 1,
                                       @QUERYPARAM('startmonthyear', Validator_ISO8601) startmonthyear?: string)
    : Promise<Transaction[]> {

    const to: Date = this.getToDate(startmonthyear);
    const from: string = this.calculateFromDate(Math.max(1, count), to);

    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: TransactionApi = await this.ahoiApi.getTransactionApi(installationId);
    return api.listTransactions(accessid, accountid, 0, undefined, 0, from, to.toISOString());
  }

  @GET('/transactionssummary')
  public async getTransactionsSummary(@USER() user: any,
                                      @QUERYPARAM('accessid', Validator_UUIDRequired) accessid: string,
                                      @QUERYPARAM('accountid', Validator_UUIDRequired) accountid: string)
    : Promise<MonthlySummary[]> {
    const installationId: string = await this.userService.getInstallationId(user.id);
    const api: TransactionSummaryApi = await this.ahoiApi.getTransactionSummaryApi(installationId);
    return api.listSummary(accessid, accessid, 1);
  }

  private calculateFromDate(count: number, toDate: Date): string {
    const start = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    if (count > 1) {
      start.setMonth(start.getMonth() - (count - 1));
    }
    return start.toISOString();
  }

  private getToDate(monthYear?: string): Date {
    const useDate = monthYear ? new Date(monthYear) : new Date();
    const toDate = new Date(useDate.getFullYear(), useDate.getMonth() + 1, 0);
    const currentDate = new Date();
    return toDate.getTime() > currentDate.getTime() ? currentDate : toDate;
  }

}
