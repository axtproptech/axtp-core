import { badRequest, internal, isBoom } from "@hapi/boom";
import { NextApiResponse } from "next";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { ValidationError } from "yup";

export const handleError = ({ e, res }: { e: any; res: NextApiResponse }) => {
  let boom = e;
  if (!isBoom(e)) {
    boom = internal(e.message);
    if (e instanceof ValidationError) {
      boom = badRequest(e.errors.join(","));
    }
  }

  const { output } = boom;
  bffLoggingService.error({
    msg: e.message,
    domain: "-",
    detail: output,
  });
  res.status(output.statusCode).json(output.payload);
};
