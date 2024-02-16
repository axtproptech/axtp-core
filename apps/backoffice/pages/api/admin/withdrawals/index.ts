import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { registerWithdrawal } from "@/bff/handler/withdrawals/registerWithdrawal";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerWithdrawal,
    middlewares: [requireAuth],
  });
}
