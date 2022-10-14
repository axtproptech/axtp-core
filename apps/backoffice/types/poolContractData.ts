import { Transaction } from "@signumjs/core";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { ApprovalStatus } from "@/types/approvalStatus";

export interface PoolContractData {
  balance: string;
  token: BasicTokenInfo;
  masterToken: BasicTokenInfo;
  transactions: Transaction[];
  approvalStatusDistribution: ApprovalStatus;
  pendingDistribution: number;
  paidDistribution: number;
  maxShareQuantity: number;
  nominalLiquidity: number;
  tokenRate: number;
  grossMarketValue: number;
  poolId: string;
}
