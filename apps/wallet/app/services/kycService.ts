import { Http, HttpError } from "@signumjs/http";
import retry, { AbortError } from "p-retry";
import { CustomerSafeData } from "@/types/customerSafeData";
import { CustomerPaymentData } from "@/types/customerPaymentData";

export class KycService {
  constructor(private bffClient: Http) {}

  private tryFetch(fetchFn: Function) {
    return retry(async () => {
      try {
        return await fetchFn();
      } catch (e: any) {
        if (e instanceof HttpError) {
          if (e.status === 404) {
            throw new AbortError(e.message);
          }
        }
      }
    });
  }

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
    return this.tryFetch(async () => {
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
    return this.tryFetch(async () => {
      const { response } = await this.bffClient.get(`/customer/${customerId}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByPublicKey(publicKey: string) {
    return this.tryFetch(async () => {
      const { response } = await this.bffClient.get(
        `/customer?publicKey=${publicKey}`
      );
      return response as CustomerSafeData;
    });
  }
  //
  async fetchCustomerDataByCpf(cpf: string) {
    return this.tryFetch(async () => {
      const { response } = await this.bffClient.get(`/customer?cpf=${cpf}`);
      return response;
    });
  }

  async fetchCustomerPayments(customerId: string) {
    return this.tryFetch(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/payments`
      );
      return response as CustomerPaymentData[];
    });
  }
}
