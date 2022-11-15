import { ApiHandler } from "@/bff/types/apiHandler";
import { resetPassword } from "@/bff/handler/me/actions/resetPassword";
import { badRequest } from "@hapi/boom";

export const postActions: ApiHandler = async (args) => {
  const { req } = args;
  const action = req.query.action as string;
  if (action === "reset-password") {
    return resetPassword(args);
  }

  throw badRequest("Unknown action");
};
