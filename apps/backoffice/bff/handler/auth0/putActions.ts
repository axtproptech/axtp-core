import { ApiHandler } from "@/bff/types/apiHandler";
import { resetPassword } from "@/bff/handler/me/actions/resetPassword";
import { badRequest } from "@hapi/boom";
import { blockAuth0User } from "@/bff/handler/auth0/blockAuth0User";

export const putActions: ApiHandler = async (args) => {
  const { req } = args;
  const action = req.query.action as string;
  if (action === "block-user") {
    return blockAuth0User(args);
  }

  throw badRequest("Unknown action");
};
