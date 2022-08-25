import { fetcher } from "@/app/fetcher";

const toNumber = (v: any): number => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? -1 : n;
};

const toBoolean = (v: string): boolean => v.toLowerCase() === "true";

const fromArray = (csv: string): string[] => csv.split(",");

export const Config = {
  Fetcher: fetcher,
  Ledger: {
    AddressPrefix: process.env.NEXT_PUBLIC_LEDGER_ACCOUNT_PREFIX || "TS",
    PollingInterval:
      toNumber(process.env.NEXT_PUBLIC_LEDGER_POLLING_INTERVAL_SECS || "30") *
      1000,
    Hosts: fromArray(
      process.env.NEXT_PUBLIC_LEDGER_HOST_URLS || "http://localhost:6876"
    ),
    ExplorerUrl:
      process.env.NEXT_PUBLIC_LEDGER_EXPLORER_URL ||
      "https//t-chain.signum.network",
  },
  Contracts: {
    PoolContractIds: fromArray(process.env.NEXT_PUBLIC_AXTP_CONTRACT_IDS || ""),
  },
  Tokens: {
    AXT: process.env.NEXT_PUBLIC_AXT_TOKEN_ID || "",
    AXTPs: fromArray(process.env.NEXT_PUBLIC_AXTP_TOKEN_IDS || ""),
  },
};
