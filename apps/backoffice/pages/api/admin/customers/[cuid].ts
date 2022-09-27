import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { getCustomer } from "@/bff/handler/customers/getCustomer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getCustomer,
    middlewares: [requireAuth],
  });
}
