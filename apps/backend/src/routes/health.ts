import { Hono } from "hono";
import { version } from "../../package.json";
import { generateRandomHexToken } from "@axtp/core";

const startTime = Date.now();

export const health = new Hono().get("/", (c) => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    id: generateRandomHexToken(12),
  };

  return c.json(healthData);
});
