import { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware, Middleware } from "@/bff/withMiddleware";
import process from "process";
import Boom from "@hapi/boom";
import { requireApiKey } from "@/bff/middlewares/requireApiKey";

export type RouteHandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => unknown | Promise<unknown>;

interface RouteArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  post?: RouteHandlerFunction;
  get?: RouteHandlerFunction;
  delete?: RouteHandlerFunction;
  put?: RouteHandlerFunction;
  head?: RouteHandlerFunction;
  options?: RouteHandlerFunction;
  middlewares?: Middleware[];
}

export async function route(routeArgs: RouteArgs): Promise<void> {
  const { req, res, middlewares = [] } = routeArgs;
  const handlerFunction = req.method
    ? // @ts-ignore
      routeArgs[req.method.toLowerCase()]
    : undefined;
  try {
    if (handlerFunction) {
      await withMiddleware(...middlewares).do(handlerFunction)(req, res);
    } else {
      // if no handler than route does not exists
      res.status(404).end();
    }
  } catch (err: any) {
    console.error(
      `BFF Errored in [${req.method} ${handlerFunction.name}]`,
      err
    );
    // TODO: using 500 in case of unknown errors - we need another page for it,
    //  or some other less intrusive treatment, i.e. a message
    res.status(404).end();
  } finally {
    res.end();
  }
}

export async function protectedRoute(args: RouteArgs) {
  const newArgs = { ...args };
  newArgs.middlewares = args.middlewares || [];
  newArgs.middlewares.unshift(requireApiKey);
  return route(newArgs);
}
