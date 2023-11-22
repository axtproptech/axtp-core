import { Http, HttpClientFactory } from "@signumjs/http";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

interface CustomerUpdateAddressArgs {
  addressId: string;
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postalCode: string;
    state: string;
  };
}

export class CustomerInstanceService {
  private http: Http;

  constructor(private cuid: string) {
    this.http = HttpClientFactory.createHttpClient(
      `/api/admin/customers/${cuid}`
    );
  }

  get customerId() {
    return this.cuid;
  }

  async fetchCustomer() {
    const { response } = await this.http.get("");
    return response as CustomerFullResponse;
  }

  async verifyCustomer(verificationLevel: "Level1" | "Level2") {
    const { response } = await this.http.put("", {
      verificationLevel,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerActivationState(isActive: boolean) {
    const { response } = await this.http.put("", {
      isActive,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerBlockingState(isBlocked: boolean) {
    const { response } = await this.http.put("", {
      isBlocked,
    });
    return response as CustomerFullResponse;
  }

  async setCustomerInvitationState(isInvited: boolean) {
    const { response } = await this.http.put("", {
      isInvited,
    });
    return response as CustomerFullResponse;
  }

  async updateCustomer({
    firstName,
    lastName,
    email1,
    phone1,
    dateOfBirth,
    placeOfBirth,
  }: {
    firstName?: string;
    lastName?: string;
    email1?: string;
    phone1?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
  }) {
    const { response } = await this.http.put("", {
      firstName,
      lastName,
      email1,
      phone1,
      dateOfBirth,
      placeOfBirth,
    });
    return response as CustomerFullResponse;
  }

  async updateCustomerAddress(address: CustomerUpdateAddressArgs) {
    throw new Error("Not implemented");
    // const { response } = await this.http.put("", {
    //   firstName,
    //   lastName,
    //   email1,
    //   phone1,
    //   dateOfBirth,
    //   placeOfBirth,
    // });
    // return response as CustomerFullResponse;
  }

  async uploadDocuments() {
    console.log("Implement uploadDocuments");
  }

  async deleteDocument(documentId: number) {
    return this.http.delete(`documents/${documentId}`);
  }
}
