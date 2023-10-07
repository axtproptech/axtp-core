import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { registerCustomerFromJotform } from "@/bff/handler/customer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerCustomerFromJotform,
  });
}
