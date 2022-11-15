import { Http, HttpClientFactory } from "@signumjs/http";

export class AdminService {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin");
  }

  async requestPasswordReset() {
    return this.http.post("/me?action=reset-password", {});
  }
}

export const adminService = new AdminService();
