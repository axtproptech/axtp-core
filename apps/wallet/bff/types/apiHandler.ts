import { NextApiRequest, NextApiResponse } from "next";
export declare type ApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;
