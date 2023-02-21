import { internal } from "@hapi/boom";
import { NextApiResponse } from "next";
import { bffLoggingService } from "@/bff/bffLoggingService";

export const handleError = ({ e, res }: { e: any; res: NextApiResponse }) => {
  const { output } = internal(e.message);
  bffLoggingService.error({
    msg: e.message,
    domain: "-",
    detail: output,
  });
  res.status(output.statusCode).json(output.payload);
};
