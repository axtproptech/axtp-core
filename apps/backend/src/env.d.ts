declare module "bun" {
  interface Env {
    PORT: number;
    JOB_CONCURRENCY: number;
    API_KEY: string;
    AXIOM_KEY: string;
    AXIOM_DATASET: string;
  }
}
