import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { propagateWithdrawalRequest } from "@/bff/handler/withdrawals/propagateWithdrawalRequest";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    post: propagateWithdrawalRequest,
  });
}
