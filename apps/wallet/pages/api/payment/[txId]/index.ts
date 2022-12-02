import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getChargeStatus } from "@/bff/handler/payment/getChargeStatus";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getChargeStatus,
  });
}
