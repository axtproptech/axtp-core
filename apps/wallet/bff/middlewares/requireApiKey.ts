import Boom from "@hapi/boom";
import { Middleware } from "@/bff/withMiddleware";
import * as process from "process";

export const requireApiKey: Middleware = async ({
  req,
}): Promise<boolean | undefined> => {
  if (req.headers["x-api-key"] === process.env.NEXT_PUBLIC_BFF_API_KEY) {
    return true;
  }
  throw Boom.unauthorized();
};
