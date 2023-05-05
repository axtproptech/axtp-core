import { Http, HttpClientFactory } from "@signumjs/http";

export class Auth0Service {
  private http: Http;

  constructor() {
    this.http = HttpClientFactory.createHttpClient("/api/admin/auth0");
  }

  async createUser(cuid: string) {
    return this.http.post(`/user/${cuid}`, {});
  }

  async setUserBlocked(cuid: string, isBlocked: boolean) {
    return this.http.put(`/user/${cuid}?action=block-user`, {
      isBlocked,
    });
  }
}

export const auth0Service = new Auth0Service();
