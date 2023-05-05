import { ApiHandler } from "@/bff/types/apiHandler";
import { resetPassword } from "@/bff/handler/me/actions/resetPassword";
import { badRequest } from "@hapi/boom";
import { updateAuth0UserBlockStatus } from "@/bff/handler/auth0/updateAuth0UserBlockStatus";

export const putActions: ApiHandler = async (args) => {
  const { req } = args;
  const action = req.query.action as string;
  if (action === "block-user") {
    return updateAuth0UserBlockStatus(args);
  }

  throw badRequest("Unknown action");
};
