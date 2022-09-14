import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { addPublicKey } from "@/bff/handler/customer/addPublicKey";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: addPublicKey,
  });
}
