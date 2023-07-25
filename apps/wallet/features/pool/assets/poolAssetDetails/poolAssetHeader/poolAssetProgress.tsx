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
import { AssetAlias, AssetAliasData, type AssetAliasHistory } from "@axtp/core";
import { PoolAssetStatus } from "../../components/poolAssetStatus";

const Stat = Stats.Stat;

interface Props {
  poolData: PoolContractData;
  asset: AssetAliasData;
  assetHistory?: AssetAliasHistory;
}

export const PoolAssetProgress: FC<Props> = ({ poolData, asset }) => {
  const account = useAccount();
  const { t } = useTranslation();

  const axtcToken = useAppSelector(selectAXTToken);
  const stats = useMemo(() => {
    return {
      gmv: poolData.grossMarketValue,
      initial: poolData.nominalLiquidity,
      established: new Date(poolData.created).toLocaleDateString(),
      relGmv:
        (poolData.grossMarketValue / poolData.nominalLiquidity) * 100 - 100,
    };
  }, [poolData]);

  const iconUrl = useMemo(() => {
    if (!poolData) return "";
    return hashicon(poolData.poolId, { size: 64 }).toDataURL();
  }, [poolData]);

  return (
    <section className="flex-row gap-x-2 flex mx-auto justify-between items-center">
      <PoolAssetStatus asset={asset} full />
    </section>
  );
};
