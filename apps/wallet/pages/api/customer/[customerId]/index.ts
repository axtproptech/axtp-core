import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { getCustomer } from "@/bff/handler/customer/getCustomer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    get: getCustomer,
  });
}
