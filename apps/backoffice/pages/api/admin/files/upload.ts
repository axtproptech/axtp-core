import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { createUploadURL } from "@/bff/handler/files";
import { requireAuth } from "@/bff/middlewares/requireAuth";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: createUploadURL,
    middlewares: [requireAuth],
  });
}
