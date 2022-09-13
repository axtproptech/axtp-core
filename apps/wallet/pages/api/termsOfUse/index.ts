import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { acceptTermsOfUse, getTermsOfUse } from "@/bff/handler/termsOfUse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    put: acceptTermsOfUse,
    get: getTermsOfUse,
  });
}
