import { NextApiRequest, NextApiResponse } from "next";
import { ContextType } from "../context";

interface ApiHandlerArgs {
  req: NextApiRequest;
  res: NextApiResponse;
  ctx: ContextType;
}

export declare type ApiHandler<T = any> = (
  args: ApiHandlerArgs
) => void | Promise<void>;
