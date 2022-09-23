import { NextApiRequest, NextApiResponse } from "next";
import { ContextType } from "./context";
import { ApiHandler } from "./types/apiHandler";

interface MiddlewareArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  ctx: ContextType;
}

export type Middleware = (
  args: MiddlewareArgs
) => Promise<boolean | undefined> | boolean | undefined;

function isPromise(value: any) {
  return Boolean(value && typeof value.then === "function");
}

export const withMiddleware = (...warez: Middleware[]) => ({
  do:
    (handler: ApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse, ctx: ContextType) => {
      for (let ware of warez) {
        let result = await Promise.resolve(ware({ req, res, ctx }));
        // if (isPromise(ware)) {
        //     result = await ware({req, res, ctx})
        // } else {
        //     result =
        // }
        if (!result) {
          return;
        }
      }
      return handler({ req, res, ctx });
    },
});
