import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { registerWithdrawalConfirmation } from "@/bff/handler/withdrawals/registerWithdrawalConfirmation";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerWithdrawalConfirmation,
    middlewares: [requireAuth],
  });
}
