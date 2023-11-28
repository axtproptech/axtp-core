import { Http, HttpError } from "@signumjs/http";
import retry, { AbortError } from "p-retry";
import { PaymentStatusResponse } from "@/bff/types/paymentStatusResponse";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { RegisterPaymentResponse } from "@/bff/types/registerPaymentResponse";

interface SendPaymentRegistrationMailArgs {
  poolId: string;
  tokenName: string;
  tokenQnt: string;
  cuid: string;
  txId: string;
}

export class PaymentService {
  constructor(private bffClient: Http) {}

  private tryCall<T>(fetchFn: Function) {
    return retry(async () => {
      try {
        return (await fetchFn()) as T;
      } catch (e: any) {
        if (e instanceof HttpError) {
          if (e.status >= 400 && e.status <= 500) {
            throw new AbortError(e.data.message);
          }
        }
      }
    });
  }

  getUsdcPaymentStatus(txId: string, protocol: BlockchainProtocolType) {
    return this.tryCall<PaymentStatusResponse>(async () => {
      const { response } = await this.bffClient.get(
        `/payment/usdc/${txId}?protocol=${protocol}`
      );
      return response;
    });
  }

  createPaymentRecord(args: RegisterPaymentRequest) {
    return this.tryCall<RegisterPaymentResponse>(async () => {
      const { response } = await this.bffClient.post(`/payment/record`, {
        ...args,
      });
      return response;
    });
  }
}
