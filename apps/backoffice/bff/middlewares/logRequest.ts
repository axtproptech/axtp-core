import { Middleware } from "../withMiddleware";

export const logRequest: Middleware = ({ req, ctx }) => {
  const { body, method, url, headers } = req;
  const { logger } = ctx;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  logger.log({
    headers,
    ip,
    method,
    url,
    body,
  });
  return true;
};
