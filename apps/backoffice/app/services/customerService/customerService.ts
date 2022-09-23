import { Http, HttpClientFactory } from "@signumjs/http";

export class CustomerService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/");
  }

  fetchPendingCustomers() {}
}
