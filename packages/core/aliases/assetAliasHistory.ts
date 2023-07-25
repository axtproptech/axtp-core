import { AssetAliasData } from "./assetAlias";

export interface AssetAliasHistoryItem {
  timestamp: number;
  transactionId: string;
  assetData: AssetAliasData;
}

export type AssetAliasHistory = AssetAliasHistoryItem[];
