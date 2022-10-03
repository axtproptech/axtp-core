import { Http, HttpClientFactory } from "@signumjs/http";
import { jsonToQueryString } from "@/app/jsonToQueryString";
import { CustomerResponse } from "@/bff/types/customerResponse";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

type Troolean = "all" | "true" | "false" | boolean;

interface FetchPendingCustomersArgs {
  verified?: Troolean;
  active?: Troolean;
  blocked?: Troolean;
}

export class CustomerService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }

  async fetchCustomers(args?: FetchPendingCustomersArgs) {
    const params = args ? jsonToQueryString(args) : "";
    const { response } = await this.http.get(
      params ? `/customers?${params}` : "/customers"
    );
    return response as CustomerResponse[];
  }

  fetchPendingCustomers() {
    return this.fetchCustomers({ verified: "false" });
  }

  async fetchCustomer(cuid: string) {
    const { response } = await this.http.get(`/customers/${cuid}`);
    return response as CustomerFullResponse;
  }
}

export const customerService = new CustomerService();
