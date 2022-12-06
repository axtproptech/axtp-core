import { HandlerFunction } from "@/bff/route";

export const getChargeStatus: HandlerFunction = async (req, res) => {
  const { txId } = req.query;

  // TODO get status from charge - pagseguro

  res.status(200).json({
    status: "pending",
  });
};
