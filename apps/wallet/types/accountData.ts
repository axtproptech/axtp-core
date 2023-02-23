import { TokenMetaData } from "@/types/tokenMetaData";
import { TransactionData } from "@/types/transactionData";

export interface AccountData {
  accountId: string;
  name: string;
  description: string;
  isActive: boolean;
  balanceSigna: string;
  balanceAxt: string;
  balancesPools: (TokenMetaData & { quantity: string })[];
  // transactions: TransactionData[];
}

export const DefaultAccountData: AccountData = {
  accountId: "",
  name: "",
  description: "",
  isActive: false,
  balanceSigna: "0",
  balanceAxt: "0",
  balancesPools: [],
  // transactions: [],
};
