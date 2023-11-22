import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { updateCustomerAddress } from "@/bff/handler/customers/updateCustomerAddress";
import { requireAuth } from "@/bff/middlewares/requireAuth";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    put: updateCustomerAddress,
    middlewares: [requireAuth],
  });
}
