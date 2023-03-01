import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { getPayment, updatePayment } from "@/bff/handler/payments";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getPayment,
    put: updatePayment,
    middlewares: [requireAuth],
  });
}
