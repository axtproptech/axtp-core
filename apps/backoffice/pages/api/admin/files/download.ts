import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { createDownloadURL } from "@/bff/handler/files";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    post: createDownloadURL,
  });
}
