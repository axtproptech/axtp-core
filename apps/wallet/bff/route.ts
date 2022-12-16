import { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware, Middleware } from "@/bff/withMiddleware";
import { ApiHandler } from "./types/apiHandler";
import process from "process";
import Boom from "@hapi/boom";

export type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => unknown | Promise<unknown>;

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

export async function route(routeArgs: RouteArgs): Promise<void> {
  const { req, res, middlewares = [] } = routeArgs;
  const handlerFunction = req.method
    ? // @ts-ignore
      routeArgs[req.method.toLowerCase()]
    : undefined;
  try {
    if (handlerFunction) {
      // api key is mandatory
      if (req.headers["x-api-key"] !== process.env.NEXT_PUBLIC_BFF_API_KEY) {
        throw Boom.unauthorized();
      }
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
