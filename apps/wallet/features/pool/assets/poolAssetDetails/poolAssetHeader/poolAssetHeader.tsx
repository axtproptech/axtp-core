import { FC } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { AssetAlias, type AssetAliasHistory } from "@axtp/core";
import { PoolAssetTitle } from "./poolAssetTitle";
import { PoolAssetProgress } from "./poolAssetProgress";

interface Props {
  poolData: PoolContractData;
  assetAlias: AssetAlias;
  assetHistory?: AssetAliasHistory;
}

export const PoolAssetHeader: FC<Props> = ({
  poolData,
  assetAlias,
  assetHistory,
}) => {
  const asset = assetAlias.getData();
  return (
    <div className="relative w-full p-8 pb-1">
      <PoolAssetTitle poolData={poolData} asset={asset} />
      <div className="mt-4">
        <PoolAssetProgress
          poolData={poolData}
          asset={asset}
          assetHistory={assetHistory}
        />
      </div>
    </div>
  );
};
