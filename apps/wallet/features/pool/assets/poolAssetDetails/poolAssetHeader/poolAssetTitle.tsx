import { FC, useMemo } from "react";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { AssetAliasData, type AssetAliasHistory } from "@axtp/core";

interface Props {
  poolData: PoolContractData;
  asset: AssetAliasData;
  assetHistory?: AssetAliasHistory;
}

export const PoolAssetTitle: FC<Props> = ({ poolData, asset }) => {
  const iconUrl = useMemo(() => {
    if (!poolData) return "";
    return hashicon(poolData.poolId, { size: 64 }).toDataURL();
  }, [poolData]);

  return (
    <section className="flex-row gap-x-2 flex mx-auto justify-between items-center">
      <div className="rounded-badge bg-accent flex-row gap-x-2 flex py-1 px-4">
        <figure className="w-[24px] flex-col relative">
          <img src={iconUrl} alt={poolData.token.name} />
        </figure>
        <div className="text-center">
          <h2 className="text-lg">{poolData.token.name}</h2>
        </div>
      </div>
      <div className="text-gray-200">
        <h2 className="text-lg text-right text-ellipsis whitespace-nowrap overflow-hidden w-3/4 md:w-full">
          {asset.name}
        </h2>
      </div>
    </section>
  );
};
