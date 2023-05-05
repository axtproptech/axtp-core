import { HttpClientFactory, Http } from "@signumjs/http";
import { GetAccessTokenResponse } from "@/bff/types/getAccessTokenResponse";
import { randomUUID } from "crypto";
import axios from "axios";

interface CreateUserArgs {
  email: string;
  firstName: string;
  lastName: string;
  cuid: string;
}

interface SetUserBlockedArgs {
  isBlocked: boolean;
  cuid: string;
}

export class Auth0Service {
  private auth0Client: Http;

  constructor(private accessToken: GetAccessTokenResponse) {
    const { token_type, access_token } = accessToken;
    this.auth0Client = HttpClientFactory.createHttpClient(
      `${process.env.NEXT_SERVER_AUTH0_ISSUER}/api/v2`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );
  }

  static async getAccessToken() {
    const auth0Api = HttpClientFactory.createHttpClient(
      process.env.NEXT_SERVER_AUTH0_ISSUER || ""
    );

    const response = await auth0Api.post(
      "/oauth/token",
      {
        client_id: process.env.NEXT_SERVER_AUTH0_API_CLIENT_ID,
        client_secret: process.env.NEXT_SERVER_AUTH0_API_CLIENT_SECRET,
        audience: `${process.env.NEXT_SERVER_AUTH0_ISSUER}/api/v2/`,
        grant_type: "client_credentials",
      },
      {
        headers: { "content-type": "application/json" },
      }
    );

    return response.response as GetAccessTokenResponse;
  }

  async createUser({ firstName, lastName, email, cuid }: CreateUserArgs) {
    const { response: createdUser } = await this.auth0Client.post("/users", {
      connection: process.env.NEXT_SERVER_AUTH0_LANDING_CONNECTION,
      email,
      given_name: firstName,
      family_name: lastName,
      name: firstName,
      password: randomUUID(),
      user_metadata: {
        cuid,
      },
      email_verified: false,
    });
    const Days = 24 * 3600;
    const { response: invitationLink } = await this.auth0Client.post(
      "/tickets/password-change",
      {
        user_id: createdUser.user_id,
        client_id: process.env.NEXT_SERVER_AUTH0_LANDING_CLIENT_ID,
        ttl_sec: 7 * Days,
        mark_email_as_verified: true,
        includeEmailInRedirect: false,
      }
    );
    return invitationLink.ticket + "type=invite";
  }

  async getUserIdByCuid(cuid: string): Promise<string> {
    const { response: foundUsers } = await this.auth0Client.get(
      `/users?q=user_metadata.cuid=${cuid}`
    );
    return foundUsers.length === 1 ? foundUsers[0].user_id : "";
  }

  async setUserBlocked({ isBlocked, cuid }: SetUserBlockedArgs): Promise<void> {
    const userId = await this.getUserIdByCuid(cuid);

    // httpclient does not support patch method.... dirty workaround
    const { token_type, access_token } = this.accessToken;
    const client = axios.create({
      baseURL: `${process.env.NEXT_SERVER_AUTH0_ISSUER}/api/v2`,
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    });
    await client.patch(`/users/${userId}`, { blocked: isBlocked });
  }
}
