import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { TokenAccountCredits } from "@axtp/core";

export interface BurnContractData {
  id: string;
  balanceSigna: string;
  trackableTokens: Record<string, BasicTokenInfo>;
  creditorAccountIds: string[];
  tokenAccountCredits: TokenAccountCredits[];
}
