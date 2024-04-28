import { route } from "bff/route";
import { verifySecurityToken } from "bff/handler/token/verifySecurityToken";

export default function handler(req, res) {
  return route({
    req,
    res,
    put: verifySecurityToken,
  });
}
