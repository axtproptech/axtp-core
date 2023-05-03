import { HttpClientFactory } from "@signumjs/http";
import { GetAccessTokenResponse } from "@/bff/types/getAccessTokenResponse";

export const getAccessToken = async () => {
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
};
