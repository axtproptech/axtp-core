import { NextApiRequest, NextApiResponse } from "next";
import { ApiHandler } from "@/bff/types/apiHandler";

interface MiddlewareArgs {
  req: NextApiRequest;
  res: NextApiResponse;
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
    async (req: NextApiRequest, res: NextApiResponse) => {
      for (let ware of warez) {
        let result = await Promise.resolve(ware({ req, res }));
        if (!result) {
          return;
        }
      }
      return handler(req, res);
    },
});
