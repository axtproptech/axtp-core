import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";
import { object, string, boolean, ValidationError } from "yup";
import { Auth0Service } from "./internal/auth0Service";

export const updateAuth0UserBlockStatus: ApiHandler = async ({ req, res }) => {
  try {
    const querySchema = object({
      cuid: string().required(),
    });
    const { cuid } = querySchema.validateSync(req.query);

    const bodySchema = object({
      isBlocked: boolean().required(),
    });
    const { isBlocked } = bodySchema.validateSync(req.body);
    const token = await Auth0Service.getAccessToken();
    const auth0Service = new Auth0Service(token);
    await auth0Service.setUserBlocked({ cuid, isBlocked });
    res.status(204).end();
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
