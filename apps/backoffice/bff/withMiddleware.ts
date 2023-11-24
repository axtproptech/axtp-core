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

function isAsync(func: any) {
  return (
    Boolean(func && typeof func.then === "function") ||
    Object.getPrototypeOf(func).constructor.name === "AsyncFunction"
  );
}

export const withMiddleware = (...warez: Middleware[]) => ({
  do:
    (handler: ApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse, ctx: ContextType) => {
      for (let ware of warez) {
        let result; //= await Promise.resolve(ware({ req, res, ctx }));
        if (isAsync(ware)) {
          console.log("async middleware", ware.name);
          result = await ware({ req, res, ctx });
        } else {
          console.log("middleware", ware.name);
          result = ware({ req, res, ctx });
        }
        if (!result) {
          return;
        }
      }
      return handler({ req, res, ctx });
    },
});
