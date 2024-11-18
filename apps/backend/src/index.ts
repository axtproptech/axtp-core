import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import health from "./routes/health";

const app = new Hono();

// Middlewares
app.use("*", logger());
app.use("*", prettyJSON());

// Root endpoint
app.get("/", (c) => {
  return c.text("Welcome to Bun Web Service!");
});

// Health check endpoint
app.get("/health", health);

// Start the server
export default {
  port: process.env["PORT"] || 3000,
  fetch: app.fetch,
};
