import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { updateCustomer } from "@/bff/handler/customers";
import { getPayment } from "@/bff/handler/payments/getPayment";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getPayment,
    // put: updateCustomer,
    middlewares: [requireAuth],
  });
}
