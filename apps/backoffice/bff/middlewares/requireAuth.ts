import Boom from "@hapi/boom";
import { Middleware } from "../withMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export const requireAuth: Middleware = async ({
  req,
  res,
  ctx,
}): Promise<boolean | undefined> => {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
    return true;
  }
  throw Boom.unauthorized();
};
