import { NextApiRequest, NextApiResponse } from "next";
import { protectedRoute } from "@/bff/route";
import { acceptTermsOfUse, getTermsOfUse } from "@/bff/handler/termsOfUse";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return protectedRoute({
    req,
    res,
    put: acceptTermsOfUse,
    get: getTermsOfUse,
  });
}
