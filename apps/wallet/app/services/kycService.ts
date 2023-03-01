import { Http } from "@signumjs/http";
import retry from "p-retry";
import { CustomerSafeData } from "@/types/customerSafeData";
import { CustomerPaymentData } from "@/types/customerPaymentData";

export class KycService {
  constructor(private bffClient: Http) {}

  acceptTermsOfUse(customerId: string) {
    return retry(async () => {
      const { response } = await this.bffClient.put("/termsOfUse", {
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
      const { response } = await this.bffClient.post(
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
      const { response } = await this.bffClient.get(`/customer/${customerId}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByPublicKey(publicKey: string) {
    return retry(async () => {
      const { response } = await this.bffClient.get(
        `/customer?publicKey=${publicKey}`
      );
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerPayments(customerId: string) {
    return retry(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/payments`
      );
      return response as CustomerPaymentData[];
    });
  }
}
