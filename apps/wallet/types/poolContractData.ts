import { Transaction } from "@signumjs/core";
import { TokenData } from "@/types/tokenData";

export interface PoolContractData {
  created: string;
  balance: string;
  token: TokenData;
  transactions: Transaction[];
  grossMarketValue: number;
  paidDistribution: number;
  maxShareQuantity: number;
  nominalLiquidity: number;
  tokenRate: number;
  poolId: string;
}
