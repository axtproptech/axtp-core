import { BasicTokenInfo } from "./basicTokenInfo";
import { ApprovalStatus } from "./approvalStatus";

export interface PoolContractData {
  isDeactivated: boolean;
  balance: string;
  token: BasicTokenInfo;
  masterToken: BasicTokenInfo;
  approvalStatusDistribution: ApprovalStatus;
  approvalStatusRefund: ApprovalStatus;
  pendingDistribution: number;
  pendingRefund: number;
  paidDistribution: number;
  maxShareQuantity: number;
  nominalLiquidity: number;
  tokenRate: number;
  grossMarketValue: number;
  poolId: string;
  aliasName: string;
}
