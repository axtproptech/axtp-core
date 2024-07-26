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

  public activate(publickey: string) {
    const account = Address.fromPublicKey(publickey).getNumericId();
    return retry(async () => {
      const { response } = await this.httpClient.post("/api/activate", {
        account,
        publickey,
        ref: "axtp-wallet",
      });
      return response;
    });
  }
}
