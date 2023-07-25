import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade } from "react-awesome-reveal";
import { PoolAssetsStats } from "./poolAssetsStats";
import { PoolAssetsList } from "./poolAssetList";
import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { RiArrowUpSLine } from "react-icons/ri";
import { mockedAssetAlias } from "../mockedAssetAlias";
import { HintBox } from "@/app/components/hintBox";
import { AnimatedIconGlobe } from "@/app/components/animatedIcons/animatedIconGlobe";
import { PoolHeader } from "@/features/pool/components/poolHeader";

interface Props {
  poolId: string;
}

export const PoolAssets: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const ledgerService = useLedgerService();
  const [isStatsCollapsed, setStatsCollapsed] = useState(false);

  // const { data: assetMap, error } = useSWR(
  //   ledgerService ? `pool/${poolId}/assets` : null,
  //   async () =>
  //     !ledgerService
  //       ? null
  //       : ledgerService.asset.fetchAllPoolAssetsData(poolId),
  //   {
  //     dedupingInterval: 100_000,
  //     refreshInterval: 120_000,
  //   }
  // );

  const { data: assetMap, error } = useSWR(
    ledgerService ? `pool/${poolId}/assets` : null,
    async () => Promise.resolve(mockedAssetAlias)
  );

  if (!pool) return null;
  if (!assetMap) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <PoolHeader poolData={pool} showStats={false} />
      <PoolAssetsStats assetMap={assetMap} collapsed={isStatsCollapsed} />
      <div className="relative">
        <div className="divider">
          {assetMap.size}&nbsp;{t("asset", { count: assetMap.size })}
        </div>
        <div
          className="absolute right-4 top-[-8px]"
          onClick={() => setStatsCollapsed(!isStatsCollapsed)}
        >
          <RiArrowUpSLine
            className={`bg-black rounded-full border border-primary-content border-solid p-1 ${
              isStatsCollapsed ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
            size={32}
          />
        </div>
      </div>
      <Fade>
        <div className="relative z-10">
          <Body
            className={`overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent ${
              isStatsCollapsed ? "h-full" : "h-[calc(100vh_-_520px)]"
            }`}
          >
            {assetMap.size ? (
              <PoolAssetsList assetMap={assetMap} />
            ) : (
              <div className="mt-8">
                <HintBox text={""}>
                  <div className="w-20 m-auto absolute bg-base-100 top-[-48px]">
                    <AnimatedIconGlobe touchable loopDelay={3000} />
                  </div>
                  <p className="mt-4">{t("no_assets_yet_hint")}</p>
                </HintBox>
              </div>
            )}
          </Body>
          <div className="absolute  top-[-1px] bg-gradient-to-b from-black h-4 w-full" />
        </div>
      </Fade>
    </div>
  );
};
