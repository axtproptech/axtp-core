import { Http, HttpClientFactory } from "@signumjs/http";
import retry from "p-retry";
import { ChargeStatusResponse } from "@/bff/types/chargeStatusResponse";
import { NewChargeResponse } from "@/bff/types/newChargeResponse";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { RegisterPaymentResponse } from "@/bff/types/registerPaymentResponse";

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

  getPixPaymentStatus(txId: string) {
    return retry(async () => {
      const { response } = await this.httpClient.get(`/payment/pix/${txId}`);
      return response as ChargeStatusResponse;
    });
  }

  getUsdcPaymentStatus(txId: string, protocol: BlockchainProtocolType) {
    return retry(async () => {
      const { response } = await this.httpClient.get(
        `/payment/usdc/${txId}?protocol=${protocol}`
      );
      return response as ChargeStatusResponse;
    });
  }

  createPixPaymentUrl(args: CreatePaymentUrlArgs) {
    return retry(async () => {
      const { response } = await this.httpClient.post(`/payment/pix`, {
        ...args,
      });
      return response as NewChargeResponse;
    });
  }

  createPaymentRecord(args: RegisterPaymentRequest) {
    return retry(async () => {
      const { response } = await this.httpClient.post(`/payment/record`, {
        ...args,
      });
      return response as RegisterPaymentResponse;
    });
  }
}
