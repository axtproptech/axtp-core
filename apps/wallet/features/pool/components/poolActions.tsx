import { FC } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { useRouter } from "next/router";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RiShoppingCart2Line, RiCommunityLine } from "react-icons/ri";

interface Props {
  poolData: PoolContractData;
}

export const PoolActions: FC<Props> = ({ poolData }) => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();

  // TODO: check if pool has assets
  const hasAssets = true;

  const handleAcquireShare = async () => {
    TrackingEventService.track({
      msg: "Click Buy Token",
      detail: { poolId: poolData.poolId, poolName: poolData.token.name },
    });
    await router.push(`/pool/${poolData.poolId}/acquisition`);
  };

  const handleViewAssets = async () => {
    TrackingEventService.track({
      msg: "Click View Assets",
      detail: { poolId: poolData.poolId, poolName: poolData.token.name },
    });
    await router.push(`/pool/${poolData.poolId}/assets`);
  };

  return (
    <div className="flex flex-row gap-x-4 p-2 mx-auto justify-center w-fit">
      <div className=" animate-wiggle">
        <Button
          color="primary"
          onClick={handleAcquireShare}
          startIcon={<RiShoppingCart2Line />}
        >
          {t("buy_token")}
        </Button>
      </div>
      {hasAssets && (
        <div>
          <Button
            color="accent"
            onClick={handleViewAssets}
            startIcon={<RiCommunityLine />}
          >
            {t("see_assets")}
          </Button>
        </div>
      )}
    </div>
  );
};
