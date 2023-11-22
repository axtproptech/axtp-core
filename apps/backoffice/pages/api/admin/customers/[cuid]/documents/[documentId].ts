import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { deleteCustomerDocument } from "@/bff/handler/customers/deleteCustomerDocument";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    delete: deleteCustomerDocument,
  });
}
