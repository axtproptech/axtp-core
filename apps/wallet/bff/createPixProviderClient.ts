import { HttpClientFactory } from "@signumjs/http";
import { getEnvVar } from "@/bff/getEnvVar";
export const createPixProviderClient = () => {
  return HttpClientFactory.createHttpClient(
    getEnvVar("NEXT_SERVER_PIX_PROVIDER_URL"),
    {
      headers: {
        Authorization: `Bearer ${getEnvVar("NEXT_SERVER_PIX_API_TOKEN")}`,
      },
    }
  );
};
