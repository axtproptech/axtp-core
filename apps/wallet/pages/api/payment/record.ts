import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { registerPaymentRecord } from "@/bff/handler/payment/registerPaymentRecord";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    post: registerPaymentRecord,
  });
}
