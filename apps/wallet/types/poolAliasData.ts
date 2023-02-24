export interface PoolPricing {
  tokenAmount: number;
  valueAXTC: number;
}

export interface PoolAliasData {
  description: string;
  pricing: PoolPricing[];
  maximumTokensPerCustomer: number;
  whitepaperUrl: string;
}

export const DefaultAliasData: PoolAliasData = {
  description: "",
  whitepaperUrl: "https://axtp.com.br",
  pricing: [],
  maximumTokensPerCustomer: 4,
};
