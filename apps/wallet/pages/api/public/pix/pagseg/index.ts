import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { setPaymentStatus } from "@/bff/handler/payment/pix/setPaymentStatus";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: setPaymentStatus,
  });
}
