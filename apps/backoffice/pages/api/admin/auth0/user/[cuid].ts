import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { createAuth0User } from "@/bff/handler/auth0";
import { putActions } from "@/bff/handler/auth0/putActions";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: createAuth0User,
    put: putActions,
    middlewares: [requireAuth],
  });
}
