import { FC } from "react";
import { useTranslation } from "next-i18next";
import { AssetAliasData } from "@axtp/core";
import { PoolAssetStatus } from "@/features/pool/assets/components/poolAssetStatus";
import { Number } from "@/app/components/number";

interface Props {
  id: string;
  asset: AssetAliasData;
}

export const PoolAssetsListItem: FC<Props> = ({ id, asset }) => {
  const { t } = useTranslation();

  const performance = asset.accumulatedCosts
    ? (asset.estimatedMarketValue / asset.accumulatedCosts) * 100
    : 0;

  return (
    <div className="border border-primary-content border-solid p-2 px-4 rounded-lg mb-2 glass">
      <div className="flex flex-row justify-between items-center gap-x-2">
        <div className="grow">
          <div className="text-[10px] xs:w-[96px] md:w-[180px] text-primary opacity-60 text-ellipsis whitespace-nowrap overflow-hidden">
            {asset.name}
          </div>
          <PoolAssetStatus asset={asset} />
        </div>
        <div className="text-lg mr-4">
          <Number value={performance} suffix="%" decimals={2} />
        </div>
        <div className="text-md">
          <Number value={asset.estimatedMarketValue} prefix="$" decimals={2} />
        </div>
      </div>
    </div>
  );
};
