declare module "bun" {
  interface Env {
    PORT: number;
    JOB_CONCURRENCY: number;
    API_KEY: string;
    AXIOM_KEY: string;
    AXIOM_DATASET: string;
    SIGNUM_LEDGER_URL: string;
    BREVO_API_KEY: string;
    BREVO_SENDER_EMAIL: string;
    BREVO_SENDER_NAME: string;
    AXT_KYC_MAIL_ADDRESS: string;
  }
}
