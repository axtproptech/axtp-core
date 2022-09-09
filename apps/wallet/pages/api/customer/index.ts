import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getStatus } from "@/bff/handler/status/getStatus";
import { registerCustomer } from "@/bff/handler/customer/registerCustomer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerCustomer,
  });
}
