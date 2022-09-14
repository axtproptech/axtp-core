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

  assignPublicKeyToCustomer(
    customerId: string,
    publicKey: string,
    isTestnet: boolean
  ) {
    return retry(() =>
      this.httpClient.post(`/customer/${customerId}/publicKey`, {
        publicKey,
        isTestnet,
      })
    );
  }
}
