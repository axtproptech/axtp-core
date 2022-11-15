import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { postActions } from "@/bff/handler/me/postActions";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: postActions,
    middlewares: [requireAuth],
  });
}
