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
    Explorer:
      process.env.NEXT_PUBLIC_SIGNUM_EXPLORER ||
      "https://t-chain.signum.network/",
    Network: process.env.NEXT_PUBLIC_SIGNUM_NETWORK || "Signum-TESTNET",
    AddressPrefix: process.env.NEXT_PUBLIC_SIGNUM_ADDRESS_PREFIX || "TS",
    TickerSymbol: process.env.NEXT_PUBLIC_SIGNUM_TICKER_SYMBOL || "TSIGNA",
  },
  Platform: {
    Name: process.env.NEXT_PUBLIC_PLATFORM_NAME || "signumswap.io",
    DocumentationUrl:
      process.env.NEXT_PUBLIC_PLATFORM_DOCUMENTATION_URL ||
      "https://docs.signum.network/defiportal",
    CanonicalUrl:
      process.env.NEXT_PUBLIC_PLATFORM_CANONICAL_URL || "https://signumswap.io",
  },
  MasterContract: {
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
  PoolContract: {
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
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_SEND_SHARE_TO_HOLDER ||
        "16240026124049279851",
      ApproveDistribution:
        process.env.NEXT_PUBLIC_CONTRACT_POOL_METHOD_APPROVE_DISTRIBUTE ||
        "4257520191800449546",
    },
  },
  Layout: {
    DrawerWidth: 260,
    GridSpacing: 3,
  },
};
