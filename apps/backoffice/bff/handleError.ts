import { NextApiRequest, NextApiResponse } from "next";
import { Boom, isBoom, badImplementation, boomify } from "@hapi/boom";
import { ContextType } from "./context";

interface HandleErrorArgs {
  err: Error | Boom;
  req: NextApiRequest;
  res: NextApiResponse;
  ctx?: ContextType;
}

export function handleError({ err, res, ctx }: HandleErrorArgs): void {
  try {
    console.debug("Error", err);
    // if (ctx?.logger) {
    //   ctx.logger.error(err.message, { err });
    // }
    let boom: Boom = !isBoom(err) ? badImplementation() : err;
    res.status(boom.output.statusCode).json(boom.output.payload);
  } catch (e: any) {
    const boom = boomify(e);
    res.status(500).json(boom.output.payload);
  }
}
