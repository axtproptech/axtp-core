import { HandlerFunction } from "@/bff/route";

export const registerCustomer: HandlerFunction = async (req, res) => {
  // Echoing data!
  res.status(200).json(req.body);
};
