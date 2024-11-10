import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "@/bff/handler/handleError";
import { HttpClientFactory } from "@signumjs/http";
import { getEnvVar } from "@/bff/getEnvVar";
import { toRewardResponse } from "./toRewardResponse";
import { Address } from "@signumjs/core";

export const getCustomerRewards: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;
    const baseUrl = `${getEnvVar("NEXT_SERVER_NFT_API_URL")}/api`;
    const creatorId = Address.fromPublicKey(
      getEnvVar("NEXT_PUBLIC_ACCOUNT_PRINCIPAL_PK")
    ).getNumericId();
    const nftClient = HttpClientFactory.createHttpClient(baseUrl, {
      headers: {
        "x-api-key": getEnvVar("NEXT_SERVER_NFT_API_KEY"),
      },
    });
    const { response } = await nftClient.get(
      `items?ownerId=${customerId}&creatorId=${creatorId}`
    );
    res.status(200).json(toRewardResponse(response));
  } catch (e: any) {
    handleError({ e, res });
  }
};
