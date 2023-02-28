import { Http, HttpClientFactory } from "@signumjs/http";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { PaymentStatus } from "@/types/paymentStatus";
import { PaymentFullResponse } from "@/bff/types/paymentFullResponse";

export class PaymentInstanceService {
  private http: Http;

  constructor(private txid: string) {
    this.http = HttpClientFactory.createHttpClient(
      `/api/admin/payments/${txid}`
    );
  }

  get transactionId() {
    return this.txid;
  }

  async setProcessed(recordId: string) {
    const { response } = await this.http.put("", {
      status: "Processed",
      recordId,
    });
    return response as CustomerFullResponse;
  }

  async setCancelled(recordId: string, reason: string) {
    const { response } = await this.http.put("", {
      status: "Cancelled",
      recordId,
      observation: reason,
    });
    return response as CustomerFullResponse;
  }

  async fetchPayment() {
    const { response } = await this.http.get("");
    return response as PaymentFullResponse;
  }
}
