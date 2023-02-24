import { TokenData } from "@/types/tokenData";
import { PoolAliasData } from "@/types/poolAliasData";

export interface PoolContractData {
  created: string;
  balance: string;
  token: TokenData;
  grossMarketValue: number;
  paidDistribution: number;
  maxShareQuantity: number;
  nominalLiquidity: number;
  tokenRate: number;
  poolId: string;
  aliasData: PoolAliasData;
}
