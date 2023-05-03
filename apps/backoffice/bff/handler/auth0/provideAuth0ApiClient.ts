import { GetAccessTokenResponse } from "@/bff/types/getAccessTokenResponse";
import { HttpClientFactory } from "@signumjs/http";

export const provideAuth0ApiClient = ({
  token_type,
  access_token,
}: GetAccessTokenResponse) => {
  return HttpClientFactory.createHttpClient(
    `${process.env.NEXT_SERVER_AUTH0_ISSUER}/api/v2`,
    {
      headers: {
        Authorization: `${token_type} ${access_token}`,
      },
    }
  );
};
