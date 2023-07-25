import { FC, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Number } from "@/app/components/number";
import { useRouter } from "next/router";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { AttentionSeeker } from "react-awesome-reveal";
import { Stats } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { AssetAlias, type AssetAliasHistory } from "@axtp/core";
import { PoolAssetTitle } from "@/features/pool/assets/poolAssetDetails/poolAssetHeader/poolAssetTitle";
import { PoolAssetProgress } from "@/features/pool/assets/poolAssetDetails/poolAssetHeader/poolAssetProgress";

const Stat = Stats.Stat;

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
  const account = useAccount();
  const { t } = useTranslation();

  const axtcToken = useAppSelector(selectAXTToken);
  const asset = assetAlias.getData();
  const stats = useMemo(() => {
    return {
      gmv: poolData.grossMarketValue,
      initial: poolData.nominalLiquidity,
      established: new Date(poolData.created).toLocaleDateString(),
      relGmv:
        (poolData.grossMarketValue / poolData.nominalLiquidity) * 100 - 100,
    };
  }, [poolData]);

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
