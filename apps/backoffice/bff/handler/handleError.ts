import { internal } from "@hapi/boom";
import { NextApiResponse } from "next";

export const handleError = ({ e, res }: { e: any; res: NextApiResponse }) => {
  console.log("#Error -:", e.message);
  const { output } = internal(e.message);
  res.status(output.statusCode).json(output.payload);
};
