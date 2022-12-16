import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { createNewCharge } from "@/bff/handler/payment/pix/createNewCharge";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: createNewCharge,
  });
}
