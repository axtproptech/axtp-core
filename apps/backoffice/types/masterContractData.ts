export interface TokenInfo {
  name: string;
  supply: string;
  quantity: string;
  id: string;
}

export interface ApprovalStatus {
  approvedAccounts: string[];
  quantity: string;
}

export interface MasterContractData {
  balance: string;
  token: TokenInfo;
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
}
