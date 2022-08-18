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
    AddressPrefix: process.env.LEDGER_PREFIX_HOST_URLS || "TS",
    Hosts: fromArray(
      process.env.LEDGER_ACCOUNT_PREFIX || "http://localhost:6876"
    ),
  },
};
