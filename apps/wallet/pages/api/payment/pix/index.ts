import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { createNewPayment } from "@/bff/handler/payment/pix/createNewPayment";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    post: createNewPayment,
  });
}
