import { NextApiRequest, NextApiResponse } from "next";
import { route } from "@/bff/route";
import { getExchangeRate } from "@/bff/handler/currency/getExchangeRate";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<unknown> {
  return route({
    req,
    res,
    get: getExchangeRate,
  });
}
