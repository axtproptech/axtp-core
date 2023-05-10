import { Transaction } from "@signumjs/core";
import { BasicTokenInfo } from "./basicTokenInfo";
import { ApprovalStatus } from "./approvalStatus";

export interface AxtcContractData {
  id: string;
  balance: string;
  token: BasicTokenInfo;
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
}
