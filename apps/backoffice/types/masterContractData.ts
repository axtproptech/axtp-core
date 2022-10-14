import { Transaction } from "@signumjs/core";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { ApprovalStatus } from "./approvalStatus";

export interface MasterContractData {
  id: string;
  balance: string;
  token: BasicTokenInfo;
  transactions: Transaction[];
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
}
