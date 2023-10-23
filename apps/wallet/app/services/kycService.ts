import { Http, HttpError } from "@signumjs/http";
import retry, { AbortError } from "p-retry";
import { CustomerSafeData } from "@/types/customerSafeData";
import { CustomerPaymentData } from "@/types/customerPaymentData";
import {
  DocumentStep,
  FourthStep,
  InitialSetupStep,
  MotherDataStep,
  SecondStep,
  ThirdStep,
} from "@/app/types/kycData";

export interface RegisterCustomerArgs
  extends Omit<InitialSetupStep, "code">,
    SecondStep,
    ThirdStep,
    FourthStep,
    MotherDataStep,
    DocumentStep {
  publicKey: string;
  agreeTerms: boolean;
}

export interface RegisterCustomerResponse {
  customerId: string;
}

export class KycService {
  constructor(private bffClient: Http) {}

  private tryCall<T>(fetchFn: Function) {
    return retry(async () => {
      try {
        return (await fetchFn()) as T;
      } catch (e: any) {
        if (e instanceof HttpError) {
          if (e.status >= 400 && e.status <= 500) {
            throw new AbortError(e.data.message);
          }
        }
      }
    });
  }

  /**
   * Registers a customer.
   *
   * @param args - The arguments for registering a customer.
   * @return - A promise that resolves to the response from the registration.
   */
  registerCustomer(args: RegisterCustomerArgs) {
    return this.tryCall<RegisterCustomerResponse>(async () => {
      const { response } = await this.bffClient.post("/customer", args);
      return response;
    });
  }

  /**
   * @deprecated Will be done on registerCustomer
   * @param customerId
   */
  acceptTermsOfUse(customerId: string) {
    return retry(async () => {
      const { response } = await this.bffClient.put("/termsOfUse", {
        customerId,
      });
      return response;
    });
  }

  /**
   * @deprecated Account creation/assignment is done on registerCustomer
   * @param customerId
   * @param publicKey
   * @param isTestnet
   */

  assignPublicKeyToCustomer(
    customerId: string,
    publicKey: string,
    isTestnet: boolean
  ) {
    return this.tryCall<CustomerSafeData>(async () => {
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
    return this.tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer/${customerId}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByPublicKey(publicKey: string) {
    return this.tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(
        `/customer?publicKey=${publicKey}`
      );
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByEmail(email: string) {
    return this.tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer?email=${email}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByCpf(cpf: string) {
    return this.tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer?cpf=${cpf}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerPayments(customerId: string) {
    return this.tryCall<CustomerPaymentData[]>(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/payments`
      );
      return response as CustomerPaymentData[];
    });
  }

  async sendAddressVerificationMail(emailAddress: string, firstName: string) {
    return this.tryCall<void>(async () => {
      return this.bffClient.post(`/mail/addressVerification`, {
        emailAddress,
        name: firstName,
      });
    });
  }

  async verifyEmailVerificationToken(emailAddress: string, token: string) {
    return this.tryCall<void>(async () => {
      return this.bffClient.put(`/token`, {
        subjectId: emailAddress,
        purpose: "EmailVerification",
        token,
      });
    });
  }
}
