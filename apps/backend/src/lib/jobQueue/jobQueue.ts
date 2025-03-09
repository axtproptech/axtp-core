import { eq, and, lte, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "./db/connection";
import { jobs, type Job, type NewJob } from "./db/schema";
import EventEmitter from "events";

export type JobHandler = (payload: Record<string, any>) => Promise<void>;

class JobQueue extends EventEmitter {
  private concurrency: number;

  constructor() {
    super();
    this.concurrency = Bun.env.JOB_CONCURRENCY ?? 2;
  }

  async addJob(
    type: string,
    payload: Record<string, any>,
    maxAttempts: number = 3
  ): Promise<string> {
    const id = randomUUID();

    const newJob: NewJob = {
      id,
      type,
      payload,
      status: "pending",
      maxAttempts,
      attempts: 0,
    };

    await db.insert(jobs).values(newJob);
    this.emit("jobqueue:added", { id, type, payload, maxAttempts });
    return id;
  }

  async processJobs(type: string, handler: JobHandler) {
    const workers = Array(this.concurrency)
      .fill(null)
      .map(() => this.processJobWorker(type, handler));

    await Promise.all(workers);
  }

  private async processJobWorker(type: string, handler: JobHandler) {
    while (true) {
      const job = await this.acquireJob(type);

      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      try {
        this.emit("jobqueue:processing", { ...job });
        await handler(job.payload);
        await this.completeJob(job.id);
        this.emit("jobqueue:completed", { ...job });
      } catch (e: any) {
        const error = e instanceof Error ? e.message : String(e);
        const canRetry = e instanceof AbortError;
        this.emit("jobqueue:failed", { ...job, error });
        await this.failJob(job.id, error);
      }
    }
  }

  private async acquireJob(type: string): Promise<Job | undefined> {
    return await db.transaction(async (tx) => {
      // Find a pending job with available attempts
      const job = await tx
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.type, type),
            eq(jobs.status, "pending"),
            lte(jobs.attempts, jobs.maxAttempts)
          )
        )
        .orderBy(jobs.createdAt)
        .limit(1)
        .get();

      if (!job) return undefined;

      // Mark job as processing
      await tx
        .update(jobs)
        .set({
          status: "processing",
          attempts: job.attempts + 1,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, job.id));

      return job;
    });
  }

  private async completeJob(jobId: string) {
    await db
      .update(jobs)
      .set({
        status: "completed",
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, jobId));
  }

  private async failJob(jobId: string, error: string, canRetry = true) {
    await db
      .update(jobs)
      .set({
        status: "failed",
        error,
        updatedAt: new Date(),
        attempts: canRetry ? undefined : Number.MAX_SAFE_INTEGER,
      })
      .where(eq(jobs.id, jobId));
  }

  async getJobStats(type?: string) {
    const baseQuery = db
      .select({
        type: jobs.type,
        totalJobs: sql<number>`COUNT(*)`.as("total_jobs"),
        pendingJobs:
          sql<number>`SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`.as(
            "pending_jobs"
          ),
        processingJobs:
          sql<number>`SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END)`.as(
            "processing_jobs"
          ),
        completedJobs:
          sql<number>`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`.as(
            "completed_jobs"
          ),
        failedJobs:
          sql<number>`SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END)`.as(
            "failed_jobs"
          ),
      })
      .from(jobs);

    if (type) {
      return baseQuery.where(eq(jobs.type, type)).groupBy(jobs.type).all();
    }

    return baseQuery.groupBy(jobs.type).all();
  }
}

export const jobQueue = new JobQueue();
