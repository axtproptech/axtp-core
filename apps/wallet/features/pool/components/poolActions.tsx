import { FC } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { useRouter } from "next/router";
import { useAppContext } from "@/app/hooks/useAppContext";

interface Props {
  poolData: PoolContractData;
}

export const PoolActions: FC<Props> = ({ poolData }) => {
  const { t } = useTranslation();
  const { TrackingEventService } = useAppContext();
  const router = useRouter();

  const handleAcquireShare = async () => {
    TrackingEventService.track({
      msg: "Click Buy Token",
      detail: { poolId: poolData.poolId, poolName: poolData.token.name },
    });
    await router.push(`/pool/${poolData.poolId}/acquisition`);
  };

  return (
    <div className="p-2 flex-col flex mx-auto justify-center w-fit animate-wiggle">
      <Button color="primary" onClick={handleAcquireShare}>
        {t("buy_token")}
      </Button>
    </div>
  );
};
