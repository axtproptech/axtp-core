import { withError } from "./withError";
import { Http, HttpClientFactory } from "@signumjs/http";
import { MarketData } from "@/types/marketData";
import { TickerSymbol } from "@/types/tickerSymbol";
import retry from "p-retry";
import { ChargeStatusResponse } from "@/bff/types/chargeStatusResponse";
import { NewChargeResponse } from "@/bff/types/newChargeResponse";

interface CreatePaymentUrlArgs {
  customerId: string;
  accountId: string;
  poolId: string;
  quantity: number;
  amountBrl: number;
}

export class PaymentService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient("/api");
  }

  getPaymentStatus(txId: string) {
    return retry(async () => {
      const { response } = await this.httpClient.get(`/payment/${txId}`);
      return response as ChargeStatusResponse;
    });
  }

  createPaymentUrl(args: CreatePaymentUrlArgs) {
    return retry(async () => {
      const { response } = await this.httpClient.post(`/payment`, {
        ...args,
      });
      return response as NewChargeResponse;
    });
  }
}
