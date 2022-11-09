import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import {
  getCustomerByPublicKey,
  registerCustomer,
} from "@/bff/handler/customer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getCustomerByPublicKey,
    post: registerCustomer,
  });
}
