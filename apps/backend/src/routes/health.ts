import type { Context } from "hono";
import { version } from "../../package.json";

const startTime = Date.now();

export default function health(c: Context) {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  return c.json(healthData);
}
