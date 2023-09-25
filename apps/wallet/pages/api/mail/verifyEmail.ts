import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { verifyEmail } from "@/bff/handler/mail";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    post: verifyEmail,
  });
}
