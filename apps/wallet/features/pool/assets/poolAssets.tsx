import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import { Body } from "@/app/components/layout/body";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { PoolAssetsHeader } from "@/features/pool/assets/components/poolAssetsHeader";
import { PoolAssetsStats } from "@/features/pool/assets/components/poolAssetsStats";
import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { RiArrowUpSLine } from "react-icons/ri";

interface Props {
  poolId: string;
}

export const PoolAssets: FC<Props> = ({ poolId }) => {
  const { t } = useTranslation();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const ledgerService = useLedgerService();
  const [isStatsCollapsed, setStatsCollapsed] = useState(false);

  const { data, error } = useSWR(
    ledgerService ? `pool/${poolId}/assets` : null,
    async () =>
      !ledgerService
        ? null
        : ledgerService.asset.fetchAllPoolAssetsData(poolId),
    {
      dedupingInterval: 100_000,
      refreshInterval: 120_000,
    }
  );

  if (!pool) return null;
  if (!data) return null;

  return (
    <div className="overflow-hidden h-[100vh]">
      <PoolAssetsHeader poolData={pool} />
      <PoolAssetsStats assetMap={data} collapsed={isStatsCollapsed} />
      <div className="relative">
        <div className="divider">
          {data.size}&nbsp;{t("asset", { count: data.size })}
        </div>
        <div
          className="absolute right-4 top-[-8px]"
          onClick={() => setStatsCollapsed(!isStatsCollapsed)}
        >
          <RiArrowUpSLine
            className={`${
              isStatsCollapsed ? "rotate-180" : "rotate-0"
            } transition-transform duration-300`}
            size={32}
          />
        </div>
      </div>
      <Fade>
        <div className="relative">
          <div className="absolute z-10 top-[-1px] bg-gradient-to-b from-base-100 h-4 w-full opacity-80" />
        </div>
        <Body
          className={`overflow-x-auto scrollbar-thin scroll scrollbar-thumb-accent scrollbar-thumb-rounded-full scrollbar-track-transparent ${
            isStatsCollapsed ? "h-full" : "h-[calc(100vh_-_600px)]"
          }`}
        >
          <h2> To Do </h2>
        </Body>
      </Fade>
    </div>
  );
};
