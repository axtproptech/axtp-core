import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { updateCustomerBankInformation } from "@/bff/handler/customers/updateCustomerBankInformation";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    put: updateCustomerBankInformation,
    middlewares: [requireAuth],
  });
}
