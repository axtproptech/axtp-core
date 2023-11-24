import { Middleware } from "../withMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "@axtp/db";

function stringifyBody(body: any) {
  try {
    return JSON.stringify(body);
  } catch (e) {
    return body.toString();
  }
}

export const audit: Middleware = async ({
  req,
  res,
  ctx,
}): Promise<boolean | undefined> => {
  if (
    req.method !== "PUT" &&
    req.method !== "POST" &&
    req.method !== "DELETE"
  ) {
    return Promise.resolve(true);
  }
  const session = await getServerSession(req, res, authOptions);
  await prisma.audit.create({
    data: {
      user: session?.user?.email ?? "",
      method: req.method,
      url: req.url || "",
      payload: stringifyBody(req.body),
    },
  });
  return true;
};
