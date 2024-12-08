import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const requireApikey = () => {
  return createMiddleware(async (c, next) => {
    const apikey = c.req.header("x-api-key");
    if (apikey !== Bun.env.API_KEY) {
      throw new HTTPException(403, {
        message: "Invalid API key",
      });
    }
    await next();
  });
};
