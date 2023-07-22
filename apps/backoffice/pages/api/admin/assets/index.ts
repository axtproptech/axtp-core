import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { requireAuth } from "@/bff/middlewares/requireAuth";
import { registerAsset } from "@/bff/handler/assets/registerAsset";
import { updateAsset } from "@/bff/handler/assets/updateAsset";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    put: updateAsset,
    post: registerAsset,
    middlewares: [requireAuth],
  });
}
