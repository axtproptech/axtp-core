import { Http, HttpClientFactory } from "@signumjs/http";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { PaymentFullResponse } from "@/bff/types/paymentFullResponse";

export class PaymentInstanceService {
  private http: Http;

  constructor(private id: number) {
    this.http = HttpClientFactory.createHttpClient(`/api/admin/payments/${id}`);
  }

  get paymentId() {
    return this.id;
  }

  async setProcessed(transactionId: string) {
    const { response } = await this.http.put("", {
      status: "Processed",
      transactionId,
    });
    return response as CustomerFullResponse;
  }

  async setCancelled(transactionId: string, reason: string) {
    const { response } = await this.http.put("", {
      status: "Cancelled",
      transactionId,
      observations: reason,
    });
    return response as CustomerFullResponse;
  }

  async updateTransactionId(transactionId: string) {
    const { response } = await this.http.put("", {
      status: "Pending",
      transactionId,
    });
    return response as CustomerFullResponse;
  }

  async fetchPayment() {
    const { response } = await this.http.get("");
    return response as PaymentFullResponse;
  }
}
