import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { FC, useState } from "react";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { PoolAssetDetailsStats } from "@/features/pool/assets/poolAssetDetails/poolAssetDetailsStats";
import { PoolAssetHeader } from "@/features/pool/assets/poolAssetDetails/poolAssetHeader/poolAssetHeader";
import { Body } from "@/app/components/layout/body";
import { LoadingBox } from "@/app/components/hintBoxes/loadingBox";
import * as React from "react";
import { CollapsableDivider } from "@/app/components/collapsableDivider";
import { Fade } from "react-awesome-reveal";
import { PoolAssetHistory } from "@/features/pool/assets/poolAssetDetails/poolAssetHistory/poolAssetHistory";
import { useAppContext } from "@/app/hooks/useAppContext";
import { ErrorBox } from "@/app/components/hintBoxes/errorBox";
import { RiFundsBoxLine, RiRefund2Line, RiStockLine } from "react-icons/ri";

interface Props {
  poolId: string;
  aliasId: string;
}

export const PoolAssetDetails: FC<Props> = ({ poolId, aliasId }) => {
  const { t } = useTranslation("assets");
  const { t: tc } = useTranslation();
  const { IsMobile } = useAppContext();
  const pool = useAppSelector(selectPoolContractState(poolId));
  const ledgerService = useLedgerService();
  const [isStatsCollapsed, setStatsCollapsed] = useState(false);

  const { data: assetHistory, error: assetHistoryError } = useSWR(
    ledgerService ? `pool/${poolId}/assets/${aliasId}/history` : null,
    () => ledgerService?.asset.fetchAllPoolAssetHistory(aliasId),
    {
      dedupingInterval: 100_000,
      refreshInterval: 120_000,
    }
  );

  const { data: asset, error: assetError } = useSWR(
    ledgerService ? `pool/${poolId}/assets/${aliasId}` : null,
    async () => ledgerService?.asset.fetchAssetData(aliasId),
    {
      dedupingInterval: 100_000,
      refreshInterval: 120_000,
    }
  );

  if (!pool) return null;
  if (!asset) return null;

  const isLoadingHistory = !assetHistory && !assetHistoryError;

  return (
    <div className="overflow-hidden h-[100vh]">
      <PoolAssetHeader
        poolData={pool}
        assetAlias={asset}
        assetHistory={assetHistory}
      />
      <PoolAssetDetailsStats assetAlias={asset} collapsed={isStatsCollapsed} />
      <div className="relative">
        <CollapsableDivider
          isCollapsed={isStatsCollapsed}
          onCollapse={setStatsCollapsed}
          text={t("asset_history")}
        />
        <div className="absolute top-2 left-2 text-[10px] text-gray-500 ">
          {IsMobile ? tc("tap_to_see_tx") : tc("click_to_see_tx")}
        </div>
      </div>
      <Body className="relative">
        {isLoadingHistory && (
          <section className="mt-8">
            <Fade triggerOnce>
              <LoadingBox
                title={t("asset_history_loading_title")}
                text={t("asset_history_loading_text")}
              />
            </Fade>
          </section>
        )}

        {!isLoadingHistory && (
          <section>
            <Fade triggerOnce>
              <PoolAssetHistory assetHistory={assetHistory!} />
            </Fade>
          </section>
        )}

        {assetHistoryError && (
          <section>
            <ErrorBox text={t("asset_history_error")} />
          </section>
        )}
      </Body>
    </div>
  );
};
