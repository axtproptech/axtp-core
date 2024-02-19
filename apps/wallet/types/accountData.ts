import { TokenMetaData } from "@/types/tokenMetaData";
import { TransactionData } from "@/types/transactionData";

export interface AccountData {
  accountId: string;
  name: string;
  description: string;
  isActive: boolean;
  balanceSIGNA: string;
  balanceAXTC: string;
  balancesPools: (TokenMetaData & { quantity: string })[];
  transactions: TransactionData[];
}

export const DefaultAccountData: AccountData = {
  accountId: "",
  name: "",
  description: "",
  isActive: false,
  balanceSIGNA: "0",
  balanceAXTC: "0",
  balancesPools: [],
  transactions: [],
};
