import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { getChargeStatus } from "@/bff/handler/payment/pix/getChargeStatus";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    get: getChargeStatus,
  });
}
