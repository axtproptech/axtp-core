import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getCustomer } from "@/bff/handler/customer/getCustomer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getCustomer,
  });
}
