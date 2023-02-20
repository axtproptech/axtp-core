import { Http, HttpError } from "@signumjs/http";
import retry, { AbortError } from "p-retry";
import { PaymentStatusResponse } from "@/bff/types/paymentStatusResponse";
import { NewPixPaymentResponse } from "@/bff/types/newPixPaymentResponse";
import { BlockchainProtocolType } from "@/types/blockchainProtocolType";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { RegisterPaymentResponse } from "@/bff/types/registerPaymentResponse";

interface CreatePixPaymentUrlArgs {
  customerId: string;
  accountId: string;
  tokenName: string;
  quantity: number;
  amountBrl: number;
}

export class PaymentService {
  constructor(private bffClient: Http) {}

  getPixPaymentStatus(txId: string) {
    return retry(async () => {
      const { response } = await this.bffClient.get(`/payment/pix/${txId}`);
      return response as PaymentStatusResponse;
    });
  }

  getUsdcPaymentStatus(txId: string, protocol: BlockchainProtocolType) {
    return retry(async () => {
      const { response } = await this.bffClient.get(
        `/payment/usdc/${txId}?protocol=${protocol}`
      );
      return response as PaymentStatusResponse;
    });
  }

  createPixPaymentUrl(args: CreatePixPaymentUrlArgs) {
    return retry(async () => {
      try {
        const { response } = await this.bffClient.post(`/payment/pix`, {
          ...args,
        });
        return response as NewPixPaymentResponse;
      } catch (e) {
        if (e instanceof HttpError) {
          if (e.status === 400 || e.status === 404) {
            throw new AbortError(e.data.message);
          }
        }
        throw e;
      }
    });
  }

  createPaymentRecord(args: RegisterPaymentRequest) {
    return retry(async () => {
      try {
        const { response } = await this.bffClient.post(`/payment/record`, {
          ...args,
        });
        return response as RegisterPaymentResponse;
      } catch (e) {
        if (e instanceof HttpError) {
          if (e.status === 400 || e.status === 404) {
            throw new AbortError(e.data.message);
          }
        }
        throw e;
      }
    });
  }
}
