import { Http, HttpClientFactory } from "@signumjs/http";
import retry from "p-retry";
import { Address } from "@signumjs/core";
import { Config } from "@/app/config";

export class AccountActivationService {
  private httpClient: Http;
  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient(
      Config.Ledger.ActivationServiceUrl
    );
  }

  public activate(address: Address) {
    return retry(async () => {
      const { response } = await this.httpClient.post("/api/activate", {
        account: address.getNumericId(),
        publickey: address.getPublicKey(),
        ref: "axtp-wallet",
      });
      return response;
    });
  }
}
