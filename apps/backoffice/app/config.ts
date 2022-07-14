const toNumber = (v: any): number => {
  const n = parseFloat(v);
  return Number.isNaN(n) ? -1 : n;
};

const toBoolean = (v: string): boolean => v.toLowerCase() === "true";

export const Config = {
  Signum: {
    IsTestnet: toBoolean(process.env.NEXT_PUBLIC_SIGNUM_IS_TESTNET || "false"),
    Explorer: process.env.NEXT_PUBLIC_SIGNUM_EXPLORER || "",
    Network: process.env.NEXT_PUBLIC_SIGNUM_NETWORK || "Signum-TESTNET",
    AddressPrefix: process.env.NEXT_PUBLIC_SIGNUM_ADDRESS_PREFIX || "TS",
    PlatformAccounts: {},
  },
  Platform: {
    Name: process.env.NEXT_PUBLIC_PLATFORM_NAME || "signumswap.io",
    DocumentationUrl:
      process.env.NEXT_PUBLIC_PLATFORM_DOCUMENTATION_URL ||
      "https://docs.signum.network/defiportal",
    CanonicalUrl:
      process.env.NEXT_PUBLIC_PLATFORM_CANONICAL_URL || "https://signumswap.io",
  },
  Layout: {
    DrawerWidth: 260,
    GridSpacing: 3,
  },
};
