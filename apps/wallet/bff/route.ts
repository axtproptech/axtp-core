import { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware, Middleware } from "@/bff/withMiddleware";
import { requireApiKey } from "@/bff/middlewares/requireApiKey";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { isBoom } from "@hapi/boom";

export type RouteHandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => unknown | Promise<unknown>;

interface RouteArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  post?: RouteHandlerFunction;
  get?: RouteHandlerFunction;
  patch?: RouteHandlerFunction;
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
    if (isBoom(err)) {
      bffLoggingService.error({
        msg: err.output.payload.message,
        domain: "-",
        detail: {
          method: req.method,
          function: handlerFunction.name,
          ...err,
        },
      });
      res.status(err.output.statusCode).end();
    } else {
      bffLoggingService.error({
        msg: "Unexpected Exception",
        domain: "-",
        detail: {
          method: req.method,
          function: handlerFunction.name,
          ...err,
        },
      });
      res.status(500).end();
    }
  } finally {
    res.end();
  }
}

// FIXME: improve security here!
// check for referrer, only wallet.axtp.com.br is allowed here!
export async function protectedRoute(args: RouteArgs) {
  const newArgs = { ...args };
  newArgs.middlewares = args.middlewares || [];
  newArgs.middlewares.unshift(requireApiKey);
  return route(newArgs);
}
