import { FC, useMemo, useEffect, useRef } from "react";
import { PoolContractData } from "@/types/poolContractData";
import { Numeric } from "@/app/components/numeric";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { useTranslation } from "next-i18next";
// @ts-ignore
import hashicon from "hashicon";
import { Badge } from "react-daisyui";
import { AttentionSeeker } from "react-awesome-reveal";
import { AccountData } from "@/types/accountData";
import { useRouter } from "next/router";
import { TrackingEventService } from "@/app/services";
import { useAppContext } from "@/app/hooks/useAppContext";
import { ChainValue } from "@signumjs/util";

interface Props {
  poolData: PoolContractData;
  accountData?: AccountData;
  className?: string;
}

const getPoolUrl = (poolId: string) => `/pool/${poolId}`;

export const PoolCard: FC<Props> = ({
  className = "",
  poolData,
  accountData,
}) => {
  const { t } = useTranslation();
  const { TrackingEventService, IsMobile } = useAppContext();
  const router = useRouter();
  const { name, decimals } = useAppSelector(selectAXTToken);

  useEffect(() => {
    if (poolData.poolId) {
      router.prefetch(getPoolUrl(poolData.poolId));
    }
  }, [poolData.poolId, router, router]);

  const iconUrl = useMemo(() => {
    if (!poolData) return "";
    return hashicon(poolData.poolId, { size: 64 }).toDataURL();
  }, [poolData]);

  const accountShares = useMemo(() => {
    if (!accountData) return 0;
    if (!accountData.balancesPools) return 0;

    const index = accountData.balancesPools.findIndex(
      (balance) => balance.id === poolData.token.id
    );
    return index === -1
      ? 0
      : parseInt(accountData.balancesPools[index].quantity);
  }, [accountData, poolData]);

  const soldTokens = parseFloat(poolData.token.supply);
  const freeSeats = Math.max(poolData.maxShareQuantity - soldTokens, 0);
  const performance =
    (poolData.grossMarketValue / poolData.nominalLiquidity) * 100 - 100;
  const goal = Number(
    ChainValue.create(decimals)
      .setAtomic(poolData.goalQuantity || 0)
      .getCompound()
  );
  const tokensToReachGoal = Math.max(goal / poolData.tokenRate - soldTokens, 0);

  const randomDelay = useMemo(() => {
    return 2_000 + Math.floor(Math.random() * 3_000);
  }, [poolData.poolId]); // triggers on pool changes

  const handleCardClick = () => {
    const detail = {
      poolId: poolData.poolId,
      poolName: poolData.token.name,
      account: accountData?.accountId,
    };
    TrackingEventService.track({ msg: "Pool Card Clicked", detail });
    router.push(getPoolUrl(poolData.poolId));
  };

  return (
    <div className={className}>
      <div
        className="relative card card-side w-full glass cursor-pointer h-full"
        onClick={handleCardClick}
      >
        <figure className="ml-8 mt-14 w-[64px] flex-col relative">
          <AttentionSeeker effect="rubberBand" delay={randomDelay}>
            <img src={iconUrl} alt={poolData.token.name} />
          </AttentionSeeker>
          <img
            className="blur-sm scale-y-50 opacity-40 absolute top-12"
            src={iconUrl}
            alt={`${poolData.token.name}-dropshadow`}
          />
        </figure>
        <div className="absolute top-2 right-8 text-[10px] text-gray-400 text-right">
          {IsMobile ? t("tap_to_see_more") : t("click_to_see_more")}
        </div>

        <div className="card-body">
          <div className="flex flex-row justify-between items-start">
            <h2 className="card-title mr-2">{poolData.token.name}</h2>
            <h2
              className={`card-title ${
                performance >= 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              <Numeric
                value={performance}
                prefix={performance >= 0 ? "+" : "-"}
                suffix="%"
                decimals={2}
              />
            </h2>
          </div>
          <div>
            <div className="flex flex-col justify-between items-start lg:items-end">
              <h2 className="text-lg font-bold">
                <Numeric value={poolData.grossMarketValue} suffix={name} />
              </h2>
              <Numeric
                value={poolData.grossMarketValue - poolData.nominalLiquidity}
                prefix="+"
                suffix={name}
              />
            </div>
            <div className="flex flex-row justify-between items-center relative">
              <span>
                <div className="absolute top-[6px] w-[92%]">
                  {poolData.goalQuantity > 0 && (
                    <progress
                      className="progress progress-warning opacity-30 absolute top-0 left-0"
                      value={goal}
                      max={poolData.nominalLiquidity}
                    />
                  )}
                  <progress
                    className="progress progress-info mr-1 absolute top-0 left-0"
                    value={soldTokens}
                    max={poolData.maxShareQuantity}
                  />
                </div>
              </span>
              <small className="text-right">
                {soldTokens}/{poolData.maxShareQuantity}
              </small>
            </div>
            <small>
              {freeSeats
                ? t("free_pool_seats", { count: freeSeats })
                : t("pool_full")}
            </small>
            {tokensToReachGoal > 0 && (
              <small className="ml-1">
                {t("tokens_to_reach_goal", { count: tokensToReachGoal })}
              </small>
            )}
            {accountShares > 0 && (
              <Badge color="secondary" className="absolute bottom-2 right-8">
                {t("you_own_n_shares", { count: accountShares })}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
