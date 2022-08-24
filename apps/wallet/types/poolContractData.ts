import { Transaction } from "@signumjs/core";
import { TokenData } from "@/types/tokenData";

export interface PoolContractData {
  balance: string;
  token: TokenData;
  transactions: Transaction[];
  pendingDistribution: number;
  paidDistribution: number;
  maxShareQuantity: number;
  nominalLiquidity: number;
  tokenRate: number;
  poolId: string;
}
