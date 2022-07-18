import { Amount } from "@signumjs/util";

export interface ApprovalStatus {
  approvedAccounts: string[];
  quantity: string;
}

export interface MasterContractData {
  balance: string;
  tokenId: string;
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
}
