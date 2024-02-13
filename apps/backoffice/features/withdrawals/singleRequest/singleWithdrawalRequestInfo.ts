import { BasicTokenInfo } from "@/types/basicTokenInfo";

export interface SingleWithdrawalRequestInfo {
  accountId: string;
  creditQuantity: string;
  tokenInfo: BasicTokenInfo;
}
