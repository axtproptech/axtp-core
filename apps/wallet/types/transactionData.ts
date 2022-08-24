import { TokenMetaData } from "@/types/tokenMetaData";

export interface TransactionData {
  id: string;
  explorerUrl: string;
  dateTime: string; // ISO-DATE
  timestamp: number;
  isPending: boolean;
  type: "out" | "in";
  signa: number;
  axt?: number; // AXT quantity
  poolToken?: TokenMetaData; // for pool tokens
  sender: string;
  receiver: string;
  message?: string;
}
