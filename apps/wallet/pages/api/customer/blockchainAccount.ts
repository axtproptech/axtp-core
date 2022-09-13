import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { addBlockchainAccount } from "@/bff/handler/customer/addBlockchainAccount";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: addBlockchainAccount,
  });
}
