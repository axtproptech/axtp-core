import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";
import { PoolCard } from "@/app/components/cards/poolCard";
import { Zoom } from "react-awesome-reveal";
import { HintBox } from "@/app/components/hintBox";
import { useTranslation } from "next-i18next";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";
import { PoolListAquisitionCTA } from "@/app/components/poolList/poolListAquisitionCTA";

interface Props {
  accountData?: AccountData;
}

export const PoolList: FC<Props> = ({ accountData }) => {
  const pools = useAppSelector(selectAllPools);
  const { t } = useTranslation();

  const relevantPools = useMemo(() => {
    if (!accountData) return pools;
    if (accountData && !accountData.balancesPools) return [];
    const accountPoolTokenIds = new Set(
      accountData.balancesPools.map((p) => p.id)
    );
    return pools.filter((p) => accountPoolTokenIds.has(p.token.id));
  }, [pools, accountData]);

  const hasPools = relevantPools.length > 0;

  const availablePoolsForAcquisition = useMemo(() => {
    if (hasPools) return [];
    return pools.filter((p) => {
      const soldTokens = parseFloat(p.token.supply);
      const freeSeats = Math.max(p.maxShareQuantity - soldTokens, 0);
      return freeSeats > 0;
    });
  }, [pools, hasPools]);
  return (
    <div>
      {hasPools && (
        <Zoom cascade triggerOnce>
          {relevantPools.map((p) => {
            return (
              <PoolCard
                className="mt-4 bg-gradient-to-r from-base-100 to-secondary isolate rounded-xl"
                key={p.poolId}
                poolData={p}
                accountData={accountData}
              />
            );
          })}
        </Zoom>
      )}
      {!hasPools && (
        <div className="text-center mt-8">
          <HintBox className="relative mb-8" text={t("no_pool_joined_hint")}>
            <div className="absolute w-[64px] top-[-48px] bg-base-100">
              <AnimatedIconCoins loopDelay={5000} touchable />
            </div>
          </HintBox>
          {availablePoolsForAcquisition.length > 0 && (
            <PoolListAquisitionCTA
              availablePools={availablePoolsForAcquisition}
            />
          )}
        </div>
      )}
    </div>
  );
};
