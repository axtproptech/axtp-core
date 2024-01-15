import { RouteHandlerFunction } from "@/bff/route";
import { handleError } from "@/bff/handler/handleError";
import { HttpClientFactory } from "@signumjs/http";
import { getEnvVar } from "@/bff/getEnvVar";

/*
{
  "_meta": {
    "pageSize": 25,
    "totalCount": 1
  },
  "data": [
    {
      "id": 3206,
      "nftId": "12231923840474218416",
      "collectionId": "1032971779000986159",
      "createdAt": "2023-12-07T18:02:56.000Z",
      "updatedAt": "2023-12-11T14:12:59.719Z",
      "ownerId": "13819828207269214005",
      "creatorId": "13819828207269214005",
      "descriptorCID": "bafkreigknozbwpyogd7gyek2xniul7xybxncu7ux5nszwao7g5vuqduphm",
      "name": "Certificate of Gratitude",
      "description": "In recognition of your invaluable support and belief in our vision, we express our deepest gratitude for being an integral part of AXT PropTech Company journey. Your contribution has been instrumental in shaping the future of our company, and we are truly thankful for your trust.",
      "edition": "2023",
      "identifier": 1,
      "symbol": "",
      "attributesCount": 2,
      "platformFee": 20,
      "royaltiesFee": 250,
      "royaltiesOwner": "13819828207269214005",
      "status": "NotForSale",
      "currentPrice": "0",
      "auctionEnd": 0,
      "auctionMaxPrice": "0",
      "priceDropPerBlock": null,
      "highestBidderId": null,
      "timesSoldCount": 0,
      "receivedBidsCount": 0,
      "totalRoyaltiesFee": "0",
      "totalVolumeTraded": "0",
      "totalPlatformFeePaid": "0",
      "likesCount": 0,
      "offerId": null,
      "offerPrice": null,
      "platform": "signumart.io",
      "creator": {
        "accountId": "13819828207269214005",
        "artistName": "AXT PropTech Company"
      },
      "types": [
        {
          "id": 8,
          "type": "trading cards"
        }
      ],
      "attributes": [
        {
          "id": 1005,
          "key": "level",
          "value": "1"
        },
        {
          "id": 1042,
          "key": "token",
          "value": "axtp0001"
        }
      ],
      "media": [
        {
          "id": "clq0zu58i002xv0rqcia19gyp",
          "nftId": "12231923840474218416",
          "thumbCID": "bafkreicipwvxzyi4utzmezrz2gsugs24jabys3rdgunpzdfbljkgauutaq",
          "socialCID": "bafkreihtjqctz32keikzhocqi5vhudi3y53yxu32vrp7xkgvixuovin4uu",
          "mediaCID": "bafybeifvez4es26su5l7uljozbibfjacrjchpa33xxvo6wxcvztjlxsiey:image/jpeg"
        }
      ],
      "unlockableContent": null
    }
  ]
}*/

export const getCustomerRewards: RouteHandlerFunction = async (req, res) => {
  try {
    const { customerId } = req.query;
    const baseUrl = `${getEnvVar("NEXT_SERVER_NFT_API_URL")}/api`;
    const nftClient = HttpClientFactory.createHttpClient(baseUrl, {
      headers: {
        "x-api-key": getEnvVar("NEXT_SERVER_NFT_API_KEY"),
      },
    });
    // call to NFT API
    // const {response} = await nftClient.get(`items?ownerId=${customerId}&creatorId=${getEnvVar("NEXT_PUBLIC_ACCOUNT_PRINCIPAL")}&p=100`);
    // TODO: add ownerId
    const { response } = await nftClient.get(
      `items?creatorId=${getEnvVar("NEXT_PUBLIC_ACCOUNT_PRINCIPAL")}&p=100`
    );

    // eventually map the response
    return res.status(200).json(response);
  } catch (e: any) {
    handleError({ e, res });
  }
};
