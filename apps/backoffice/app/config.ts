import { Amount } from "@signumjs/util";
import * as process from "process";

const toNumber = (v: any): number => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? -1 : n;
};

const toBoolean = (v: string): boolean => v.toLowerCase() === "true";

const toArray = (csv: string): string[] => csv.split(",");

// default values are related to TestNet
export const Config = {
  Signum: {
    IsTestnet: toBoolean(process.env.NEXT_PUBLIC_SIGNUM_IS_TESTNET || "false"),
    DefaultNode:
      process.env.NEXT_PUBLIC_SIGNUM_DEFAULT_HOST ||
      "https://europe3.testnet.signum.network",
    Explorer:
      process.env.NEXT_PUBLIC_SIGNUM_EXPLORER ||
      "https://t-chain.signum.network/",
    Network: process.env.NEXT_PUBLIC_SIGNUM_NETWORK || "Signum-TESTNET",
    AddressPrefix: process.env.NEXT_PUBLIC_SIGNUM_ADDRESS_PREFIX || "TS",
    TickerSymbol: process.env.NEXT_PUBLIC_SIGNUM_TICKER_SYMBOL || "TSIGNA",
  },
  Accounts: {
    Principal:
      process.env.NEXT_PUBLIC_ACCOUNT_PRINCIPAL || "13819828207269214005",
  },
  Platform: {
    Name: process.env.NEXT_PUBLIC_PLATFORM_NAME || "AXT PropTech Backoffice",
    Market: {
      PriceAdjustment: toNumber(
        process.env.NEXT_PUBLIC_BRLUSD_ADJUSTMENT || "0.08"
      ),
    },
  },
  MasterContract: {
    LowBalanceThreshold: Amount.fromSigna(2),
    Id: process.env.NEXT_PUBLIC_CONTRACT_MASTER_ID || "",
    ApprovalAccounts: toArray(
      process.env.NEXT_PUBLIC_CONTRACT_MASTER_APPROVAL_ACCOUNTS || ""
    ),
    ActivationCosts:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_MASTER_ACTIVATION_COSTS) ||
      "0.25",
    InteractionFee:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_MASTER_INTERACTION_FEE) ||
      "0.01",
    Methods: {
      RequestBurn:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_REQUEST_BURN ||
        "17716063335769841351",
      ApproveBurn:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_APPROVE_BURN ||
        "10152603510011201675",
      RequestMint:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_REQUEST_MINT ||
        "4952640365638570538",
      ApproveMint:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_APPROVE_MINT ||
        "10110922132472634322",
      RequestSendToPool:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_REQUEST_SEND_TO_POOL ||
        "13100857193362665644",
      ApproveSendToPool:
        process.env.NEXT_PUBLIC_CONTRACT_MASTER_METHOD_APPROVE_SEND_TO_POOL ||
        "11206579990877624803",
    },
  },
  BurnContract: {
    LowBalanceThreshold: Amount.fromSigna(2),
    Id: process.env.NEXT_PUBLIC_CONTRACT_BURN_ID || "",
    ActivationCosts:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_BURN_ACTIVATION_COSTS) ||
      "0.25",
    InteractionFee:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_BURN_INTERACTION_FEE) || "0.01",
    Methods: {
      AddTrackableToken: "1",
      RemoveTrackableToken: "2",
      CreditTrackedToken: "3",
      ReturnTrackedToken: "4",
      AddCreditor: "5",
      RemoveCreditor: "6",
    },
  },

  PoolContract: {
    LowBalanceThreshold: Amount.fromSigna(2),
    OriginId: process.env.NEXT_PUBLIC_CONTRACT_POOL_ORIGIN_ID || "",
    Reference: process.env.NEXT_PUBLIC_CONTRACT_POOL_REF || "",
    CodeHash: process.env.NEXT_PUBLIC_CONTRACT_POOL_CODEHASH || "",
    CreationCosts:
      process.env.NEXT_PUBLIC_CONTRACT_POOL_CREATION_COSTS || "0.06",
    Basename: process.env.NEXT_PUBLIC_CONTRACT_POOL_NAME || "AXTPoolContract",
    ApprovalAccounts: toArray(
      process.env.NEXT_PUBLIC_CONTRACT_POOL_APPROVAL_ACCOUNTS || ""
    ),
    ActivationCosts:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_POOL_ACTIVATION_COSTS) ||
      "0.25",
    InteractionFee:
      toNumber(process.env.NEXT_PUBLIC_CONTRACT_POOL_INTERACTION_FEE) || "0.01",
    Methods: {
      SendShareToHolder:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_SEND_SHARE_TO_HOLDER || "",
      ApproveDistribution:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_APPROVE_DISTRIBUTE || "",
      UpdateGrossMarketValue:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_UPDATE_GMV || "",
      RequestAXTCRefund:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_REQUEST_REFUND_AXTC || "",
      ApproveAXTCRefund:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_APPROVE_REFUND_AXTC || "",
    },
  },
  Layout: {
    DrawerWidth: 260,
    GridSpacing: 3,
  },
};
