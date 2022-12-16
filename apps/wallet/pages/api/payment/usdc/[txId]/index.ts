import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getUsdcTransactionStatus } from "@/bff/handler/payment/usdc/getUsdcTransactionStatus";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getUsdcTransactionStatus,
  });
}
