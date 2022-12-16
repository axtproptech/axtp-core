import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { registerPaymentRecord } from "@/bff/handler/payment/registerPaymentRecord";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerPaymentRecord,
  });
}
