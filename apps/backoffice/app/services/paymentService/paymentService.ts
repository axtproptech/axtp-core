import { Http, HttpClientFactory } from "@signumjs/http";
import { jsonToQueryString } from "@/app/jsonToQueryString";
import { PaymentInstanceService } from "./paymentInstanceService";
import { PaymentStatus } from "@/types/paymentStatus";
import { PaymentResponse } from "@/bff/types/paymentResponse";
import { RegisterPaymentRequest } from "@/bff/types/registerPaymentRequest";
import { RegisterPaymentResponse } from "@/bff/types/registerPaymentResponse";

interface FetchPendingPaymentArgs {
  status?: PaymentStatus;
}

interface RegisterPaymentArgs extends RegisterPaymentRequest {}

export class PaymentService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }
  async fetchPayments(args?: FetchPendingPaymentArgs) {
    const params = args ? jsonToQueryString(args) : "";
    const { response } = await this.http.get(
      params ? `/payments?${params}` : "/payments"
    );
    return response as PaymentResponse[];
  }

  async registerPayment(args: RegisterPaymentArgs) {
    const { response } = await this.http.post("/payments", args);
    return response as RegisterPaymentResponse;
  }

  fetchPendingPayments() {
    return this.fetchPayments({ status: "pending" });
  }

  with(txid: string): PaymentInstanceService {
    return new PaymentInstanceService(txid);
  }
}

export const paymentsService = new PaymentService();
