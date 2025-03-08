import { Http, HttpClientFactory } from "@signumjs/http";
import { jsonToQueryString } from "@/app/jsonToQueryString";
import {
  CustomerResponse,
  CustomerTableResponse,
} from "@/bff/types/customerResponse";
import { CustomerInstanceService } from "./customerInstanceService";

type Troolean = "all" | "true" | "false" | boolean;

interface FetchPendingCustomersArgs {
  name?: string;
  cpf?: string;
  email?: string;
  active?: Troolean;
  blocked?: Troolean;
  brazilian?: Troolean;
  invited?: Troolean;
  verified?: Troolean;
  page?: number;
  offset?: number;
}

export class CustomerService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }

  async fetchCustomerByAccountId(accountId: string) {
    const { response } = await this.http.get(
      `/customers?accountId=${accountId}`
    );
    return response as CustomerResponse;
  }

  async fetchCustomers(args?: FetchPendingCustomersArgs) {
    const params = args ? jsonToQueryString(args) : "";

    const { response } = await this.http.get(
      params ? `/customers?${params}` : "/customers"
    );
    return response as CustomerTableResponse;
  }

  fetchPendingCustomers() {
    return this.fetchCustomers({ verified: "false" });
  }

  with(cuid: string): CustomerInstanceService {
    return new CustomerInstanceService(cuid);
  }
}

export const customerService = new CustomerService();
