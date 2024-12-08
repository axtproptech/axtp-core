import { Hono } from "hono";
import { version } from "../../package.json";

const startTime = Date.now();

export const health = new Hono().get("/", (c) => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  return c.json(healthData);
});
