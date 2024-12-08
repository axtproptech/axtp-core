import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { health } from "./routes/health";
import { documents } from "./routes/documents";
import { requireApikey } from "./middlewares/apikey";
const app = new Hono();

// Middlewares
// app.use("*", cors({
//   origin: "*",
//   allowMethods: ["POST", "GET"]
// }));
app.use(logger());
app.use(requireApikey());
app.use("*", prettyJSON());

// base routes
app.route("/documents", documents);
app.route("/health", health);

// Start the server
export default {
  port: process.env["PORT"] || 4000,
  fetch: app.fetch,
};
