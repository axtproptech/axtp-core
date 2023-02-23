import { Http, HttpClientFactory } from "@signumjs/http";
import { getEnvVar } from "@/bff/getEnvVar";
import { bffLoggingService } from "@/bff/bffLoggingService";

export const createPixProviderClient = (): Http => {
  const host = getEnvVar("NEXT_SERVER_PIX_PROVIDER_URL");
  const pixClient = HttpClientFactory.createHttpClient(host, {
    headers: {
      Authorization: `Bearer ${getEnvVar("NEXT_SERVER_PIX_API_TOKEN")}`,
    },
  });

  return {
    post(url: string, payload: any, options?: any) {
      bffLoggingService.info({
        msg: "HTTP POST",
        detail: {
          url: host + url,
          payload,
          options,
        },
        domain: "pix",
      });
      return pixClient.post(url, payload, options);
    },
    put(url: string, payload: any, options?: any) {
      bffLoggingService.info({
        msg: "HTTP PUT",
        detail: {
          url: host + url,
          payload,
          options,
        },
        domain: "pix",
      });
      return pixClient.put(url, payload, options);
    },
    get(url: string, options?: any) {
      bffLoggingService.info({
        msg: "HTTP GET",
        detail: {
          url: host + url,
          options,
        },
        domain: "pix",
      });
      return pixClient.get(url, options);
    },
    delete(url: string, options?: any) {
      bffLoggingService.info({
        msg: "HTTP DELETE",
        detail: {
          url: host + url,
          options,
        },
        domain: "pix",
      });
      return pixClient.delete(url, options);
    },
  };
};
