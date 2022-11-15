import { Http, HttpClientFactory } from "@signumjs/http";
import retry from "p-retry";
import { CustomerSafeData } from "@/types/customerSafeData";

export class KycService {
  private readonly httpClient: Http;

  constructor() {
    this.httpClient = HttpClientFactory.createHttpClient("/api");
  }

  acceptTermsOfUse(customerId: string) {
    return retry(async () => {
      const { response } = await this.httpClient.put("/termsOfUse", {
        customerId,
      });
      return response;
    });
  }

  assignPublicKeyToCustomer(
    customerId: string,
    publicKey: string,
    isTestnet: boolean
  ) {
    return retry(async () => {
      const { response } = await this.httpClient.post(
        `/customer/${customerId}/publicKey`,
        {
          publicKey,
          isTestnet,
        }
      );
      return response;
    });
  }

  async fetchCustomerData(customerId: string) {
    return retry(async () => {
      const { response } = await this.httpClient.get(`/customer/${customerId}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByPublicKey(publicKey: string) {
    return retry(async () => {
      const { response } = await this.httpClient.get(
        `/customer?publicKey=${publicKey}`
      );
      return response as CustomerSafeData;
    });
  }
}
