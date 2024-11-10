import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { getCustomer, updateCustomer } from "@/bff/handler/customers";
import { activateCustomerLedgerAccount } from "@/bff/handler/customers/activateCustomerLedgerAccount";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: activateCustomerLedgerAccount,
    middlewares: [requireAuth],
  });
}
