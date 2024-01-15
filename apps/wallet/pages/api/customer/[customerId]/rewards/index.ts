import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { getCustomerRewards } from "@/bff/handler/customer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    get: getCustomerRewards,
  });
}
