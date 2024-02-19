import Boom from "@hapi/boom";
import { Middleware } from "@/bff/withMiddleware";
import * as process from "process";
import { getEnvVar } from "@/bff/getEnvVar";

const AcceptableReferer = getEnvVar("NEXT_PUBLIC_CANONICAL_URL");
const isDev = getEnvVar("NODE_ENV") === "development";
export const protectRoute: Middleware = async ({
  req,
}): Promise<boolean | undefined> => {
  const isReferrerAccepted = isDev
    ? true
    : req.headers["referer"] &&
      req.headers["referer"].startsWith(AcceptableReferer);
  if (
    req.headers["x-api-key"] === process.env.NEXT_PUBLIC_BFF_API_KEY &&
    isReferrerAccepted
  ) {
    return true;
  }

  throw Boom.unauthorized();
};
