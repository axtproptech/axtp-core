import { route } from "bff/route";
import { registerCustomer } from "bff/handler/customer/registerCustomer";

export default function handler(req, res) {
  return route({
    req,
    res,
    post: registerCustomer,
  });
}
