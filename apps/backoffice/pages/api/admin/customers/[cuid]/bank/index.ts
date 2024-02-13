import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { insertCustomerBankInformation } from "@/bff/handler/customers/insertCustomerBankInformation";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: insertCustomerBankInformation,
    middlewares: [requireAuth],
  });
}
