import { Http, HttpClientFactory } from "@signumjs/http";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

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
}
