import { AssetAliasHistory } from "@axtp/core/aliases";
import { PoolAssetHistoryItem } from "./poolAssetHistoryItem";

interface Props {
  assetHistory: AssetAliasHistory;
}

export const PoolAssetHistory = ({ assetHistory }: Props) => {
  return (
    <div>
      {assetHistory.map((h) => (
        <PoolAssetHistoryItem
          key={h.transactionId}
          txId={h.transactionId}
          data={h}
        />
      ))}
    </div>
  );
};
