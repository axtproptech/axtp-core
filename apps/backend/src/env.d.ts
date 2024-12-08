declare module "bun" {
  interface Env {
    PORT: number;
    API_KEY: string;
    AXIOM_KEY: string;
    AXIOM_DATASET: string;
  }
}
