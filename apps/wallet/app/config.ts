const toNumber = (v: any): number => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? -1 : n;
};

const toBoolean = (v: string): boolean => v.toLowerCase() === "true";

const fromArray = (csv: string): string[] => csv.split(",");

const isTestNet = toBoolean(
  process.env.NEXT_PUBLIC_LEDGER_IS_TESTNET || "true"
);

export const Config = {
  JotForm: {
    Id: process.env.NEXT_PUBLIC_JOTFORM_ID || "",
  },
  Market: {
    BrlUsdAdjustment: toNumber(
      process.env.NEXT_PUBLIC_BRLUSD_ADJUSTMENT || 0.05
    ),
  },
  Ledger: {
    IsTestNet: isTestNet,
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
    AXTC: process.env.NEXT_PUBLIC_AXTC_TOKEN_ID || "",
    AXTPs: fromArray(process.env.NEXT_PUBLIC_AXTP_TOKEN_IDS || ""),
  },
};
