import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { getUsdcTransactionStatus } from "@/bff/handler/payment/usdc/getUsdcTransactionStatus";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    get: getUsdcTransactionStatus,
  });
}
