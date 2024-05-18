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
import { tryCall } from "@axtp/core";
import { date, mixed, string } from "yup";
import { SignedDocumentType } from "@/types/signedDocumentType";
import { DateTimeConstants } from "@/app/dateTimeConstants";

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

export interface StoreSignedDocumentArgs {
  transactionId: string;
  customerId: string;
  expires: boolean;
  poolId?: string;
  documentHash: string;
  url: string;
  type: SignedDocumentType;
}

export interface RegisterCustomerResponse {
  customerId: string;
}

export class KycService {
  constructor(private bffClient: Http) {}

  /**
   * Registers a customer.
   *
   * @param args - The arguments for registering a customer.
   * @return - A promise that resolves to the response from the registration.
   */
  registerCustomer(args: RegisterCustomerArgs) {
    return tryCall<RegisterCustomerResponse>(async () => {
      const { response } = await this.bffClient.post("/customer", args);
      return response;
    });
  }

  storeSignedDocument(args: StoreSignedDocumentArgs) {
    return retry(async () => {
      const {
        documentHash,
        url,
        type,
        poolId,
        expires,
        transactionId,
        customerId,
      } = args;
      const exiryAt = args.expires
        ? new Date(
            Date.now() + 365 * DateTimeConstants.InMillies.Day
          ).toISOString()
        : undefined;
      const { response } = await this.bffClient.post(
        `/customer/${customerId}/signedDocument`,
        {
          exiryAt,
          url,
          type,
          poolId,
          transactionId,
          documentHash,
        }
      );
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
    return tryCall<CustomerSafeData>(async () => {
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
    return tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer/${customerId}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByPublicKey(publicKey: string) {
    return tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(
        `/customer?publicKey=${publicKey}`
      );
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByEmail(email: string) {
    return tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer?email=${email}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerDataByCpf(cpf: string) {
    return tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.get(`/customer?cpf=${cpf}`);
      return response as CustomerSafeData;
    });
  }

  async fetchCustomerPayments(customerId: string) {
    return tryCall<CustomerPaymentData[]>(async () => {
      const { response } = await this.bffClient.get(
        `/customer/${customerId}/payments`
      );
      return response as CustomerPaymentData[];
    });
  }

  async sendAddressVerificationMail(emailAddress: string, firstName: string) {
    return tryCall<void>(async () => {
      return this.bffClient.post(`/mail/addressVerification`, {
        emailAddress,
        name: firstName,
      });
    });
  }

  async verifyEmailVerificationToken(emailAddress: string, token: string) {
    return tryCall<void>(async () => {
      return this.bffClient.put(`/token`, {
        subjectId: emailAddress,
        purpose: "EmailVerification",
        token,
      });
    });
  }

  addBankingInfo(customerId: string, identifier: string, type: "Pix" | "Iban") {
    return tryCall<CustomerSafeData>(async () => {
      const { response } = await this.bffClient.post(
        `/customer/${customerId}/bankInfo`,
        {
          identifier,
          type,
        }
      );
      return response;
    });
  }
}
