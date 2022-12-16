import { RouteHandlerFunction } from "@/bff/route";

export const getChargeStatus: RouteHandlerFunction = async (req, res) => {
  const { txId } = req.query;

  // TODO get status from charge - pagseguro

  res.status(200).json({
    status: "pending",
  });
};
