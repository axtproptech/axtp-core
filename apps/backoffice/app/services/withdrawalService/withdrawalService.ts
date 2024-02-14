import { Http, HttpClientFactory } from "@signumjs/http";
import { TransactionId } from "@signumjs/core";

interface RegisterWithdrawalArgs {
  customerId: string;
  accountPk: string;
  tokenId: string;
  tokenQnt: string;
  tokenName: string;
  amount: string;
  currency: string;
  paymentType: string;
  txId: string;
  usd: string;
}

export class WithdrawalService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }

  async registerWithdrawal(args: RegisterWithdrawalArgs) {
    const { response } = await this.http.post("/withdrawals", args);
    return response as TransactionId;
  }
}

export const withdrawalService = new WithdrawalService();
