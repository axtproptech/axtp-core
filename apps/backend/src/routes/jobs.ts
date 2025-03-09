import { Hono } from "hono";
import { jobQueue } from "../lib/jobQueue";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { logger } from "../lib/logger";
import "../lib/jobHandler/testHandler";

jobQueue.on("jobqueue:add", ({ id, type }) => {
  logger.info({ jobId: id, type }, "Job added");
});

jobQueue.on("jobqueue:failed", ({ id, type, error }) => {
  logger.error({ jobId: id, type, error }, "Job failed");
});

jobQueue.on("jobqueue:processing", ({ id, type, attempts }) => {
  if (attempts > 1) {
    logger.warn({ jobId: id, type, attempts }, "Retrying Job");
  } else {
    logger.info({ jobId: id, type, attempts }, "Starting Job");
  }
});

jobQueue.on("jobqueue:completed", ({ id, type, attempts }) => {
  logger.info({ jobId: id, type, attempts }, "Job completed");
});

export const jobs = new Hono();

jobs.post(
  "/test",
  zValidator(
    "json",
    z.object({
      value: z.string(),
    })
  ),
  async (c) => {
    const { value } = c.req.valid("json");
    const jobId = await jobQueue.addJob("test", { value }, 2);
    return c.json({ jobId });
  }
);
