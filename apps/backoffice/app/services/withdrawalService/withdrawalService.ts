import { Http, HttpClientFactory } from "@signumjs/http";
import { TransactionId } from "@signumjs/core";

interface RegisterWithdrawalConfirmationArgs {
  customerId: string;
  accountPk: string;
  tokenId: string;
  tokenQnt: string;
  tokenName: string;
  tokenDecimals: number;
  amount: string;
  currency: string;
  paymentType: string;
  txId: string;
  usd: string;
}

interface RegisterWithdrawalDenialArgs {
  customerId: string;
  accountPk: string;
  tokenId: string;
  tokenQnt: string;
  tokenName: string;
  tokenDecimals: number;
  reason: string;
}

export class WithdrawalService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }

  async registerWithdrawalConfirmation(
    args: RegisterWithdrawalConfirmationArgs
  ) {
    const { response } = await this.http.post(
      "/withdrawals/confirmation",
      args
    );
    return response as TransactionId;
  }
  async registerWithdrawalDenial(args: RegisterWithdrawalDenialArgs) {
    const { response } = await this.http.post("/withdrawals/denial", args);
    return response as TransactionId;
  }
}

export const withdrawalService = new WithdrawalService();
