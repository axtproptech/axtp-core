import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { registerWithdrawalDenial } from "@/bff/handler/withdrawals/registerWithdrawalDenial";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: registerWithdrawalDenial,
    middlewares: [requireAuth],
  });
}
