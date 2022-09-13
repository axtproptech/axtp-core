import { Http, HttpClientFactory } from "@signumjs/http";
import retry from "p-retry";

export class KycService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient("/api");
  }

  acceptTermsOfUse(customerId: string) {
    return retry(() => this.httpClient.put("/termsOfUse", { customerId }));
  }
}
