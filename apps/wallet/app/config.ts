import { placeOrder } from "@signumjs/core/out/api/factories/asset/placeOrder";
import * as process from "process";

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
  // this is not "security", but at least some obstacle
  // we don't need fully fledged auth as the BFF returns only minimum, safe data
  BffApiKey: process.env.NEXT_PUBLIC_BFF_API_KEY || "",
  TermsOfUsefUrl: process.env.NEXT_PUBLIC_TERMS_OF_USE_URL || "",
  PrivacyfUrl: process.env.NEXT_PUBLIC_PRIVACY_URL || "",
  ManualUrl: process.env.NEXT_PUBLIC_MANUAL_URL || "",
  JotForm: {
    Id: process.env.NEXT_PUBLIC_JOTFORM_ID || "",
  },
  Market: {
    BrlUsdAdjustment: toNumber(
      process.env.NEXT_PUBLIC_BRLUSD_ADJUSTMENT || 0.05
    ),
  },
  Payment: {
    Usdc: {
      DepositAccountEth: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ETH || "",
      DepositAccountAlgo:
        process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_ALGO || "",
      DepositAccountSol: process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_SOL || "",
      DepositAccountMatic:
        process.env.NEXT_PUBLIC_USDC_DEPOSIT_ACCOUNT_MATIC || "",
    },
    PixKey: process.env.NEXT_PUBLIC_PIX_KEY || "",
    BankAccountInfo: {
      Name:
        process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "AXT PropTech Company S/A",
      Bank: process.env.NEXT_PUBLIC_BANK_ACCOUNT_BANK || "",
      Agency: process.env.NEXT_PUBLIC_BANK_ACCOUNT_AGENCY || "",
      Account: process.env.NEXT_PUBLIC_BANK_ACCOUNT_ACCOUNT || "",
    },
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
      "https://t-chain.signum.network",
    ActivationServiceUrl:
      process.env.NEXT_PUBLIC_LEDGER_ACTIVATION_SERVICE_URL ||
      "https://signum-account-activator-ohager.vercel.app",
  },
  Contracts: {
    PoolContractIds: fromArray(process.env.NEXT_PUBLIC_AXTP_CONTRACT_IDS || ""),
  },
  Tokens: {
    AXTC: process.env.NEXT_PUBLIC_AXTC_TOKEN_ID || "",
    AXTPs: fromArray(process.env.NEXT_PUBLIC_AXTP_TOKEN_IDS || ""),
  },
};
