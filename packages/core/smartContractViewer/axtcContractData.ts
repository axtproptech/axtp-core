import { BasicTokenInfo } from "./basicTokenInfo";
import { ApprovalStatus } from "./approvalStatus";
import { Alias } from "@signumjs/core";

export interface AxtcContractData {
  id: string;
  balance: string;
  token: BasicTokenInfo;
  currentSendPoolAddress: string;
  approvalStatusMinting: ApprovalStatus;
  approvalStatusBurning: ApprovalStatus;
  approvalStatusSendToPool: ApprovalStatus;
  alias?: Alias;
}
