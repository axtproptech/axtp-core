import { NextApiRequest, NextApiResponse } from "next";
import Boom from "@hapi/boom";

export type HandlerFunction = (
  req: NextApiRequest,
  res: NextApiResponse
) => unknown | Promise<unknown>;

interface RouteArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  post?: HandlerFunction;
  get?: HandlerFunction;
  delete?: HandlerFunction;
  put?: HandlerFunction;
  head?: HandlerFunction;
  options?: HandlerFunction;
}

const toArray = (csv: string): string[] => csv.split(",");
const AcceptedHosts = toArray(
  (process.env.NEXT_SERVER_ACCEPTED_HOSTS || "").toLowerCase()
);

export function route(routeArgs: RouteArgs): Promise<unknown> {
  const { req, res } = routeArgs;
  const referrer = new URL(req.headers.referer || "http://localhost:3000");
  const handlerFunction = req.method
    ? // @ts-ignore
      routeArgs[req.method.toLowerCase()]
    : undefined;

  if (
    !(
      AcceptedHosts.length &&
      (AcceptedHosts[0] === "*" || AcceptedHosts.includes(referrer.host))
    )
  ) {
    throw Boom.unauthorized();
  }

  try {
    if (handlerFunction) {
      return handlerFunction(req, res);
    } else {
      // if no handler than route does not exists
      res.status(404).end();
    }
  } catch (e) {
    console.error(`BFF Errored in [${req.method} ${handlerFunction.name}]`, e);
    // TODO: using 500 in case of unknown errors - we need another page for it,
    //  or some other less intrusive treatment, i.e. a message
    res.status(404).end();
  }

  return Promise.resolve();
}
