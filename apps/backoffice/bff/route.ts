import { NextApiRequest, NextApiResponse } from "next";
import { context } from "@/bff/context";
import { withMiddleware, Middleware } from "@/bff/withMiddleware";
import { ApiHandler } from "./types/apiHandler";
import { handleError } from "@/bff/handleError";
import { audit } from "@/bff/middlewares/audit";

interface RouteArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  post?: ApiHandler;
  get?: ApiHandler;
  delete?: ApiHandler;
  put?: ApiHandler;
  head?: ApiHandler;
  options?: ApiHandler;
  middlewares?: Middleware[];
}

// TODO: restrict calls to own server only
export async function route(routeArgs: RouteArgs): Promise<void> {
  const { req, res, middlewares = [] } = routeArgs;
  const handlerFunction = req.method
    ? // @ts-ignore
      routeArgs[req.method.toLowerCase()]
    : undefined;
  try {
    middlewares.push(audit);
    if (handlerFunction) {
      await withMiddleware(...middlewares).do(handlerFunction)(
        req,
        res,
        context
      );
    } else {
      // if no handler than route does not exists
      res.status(404).end();
    }
  } catch (err: any) {
    handleError({ err, req, res });
  } finally {
    res.end();
  }
}
