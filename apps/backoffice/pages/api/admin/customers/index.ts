import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getCustomers } from "@/bff/handler/customers";
import { requireAuth } from "@/bff/middlewares/requireAuth";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getCustomers,
    middlewares: [requireAuth],
  });
}
