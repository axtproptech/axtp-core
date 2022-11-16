import { internal } from "@hapi/boom";

export const handleError = ({ e, res }) => {
  console.log("#Error -:", e.message);
  const { output } = internal(e.message);
  res.status(output.statusCode).json(output.payload);
};
