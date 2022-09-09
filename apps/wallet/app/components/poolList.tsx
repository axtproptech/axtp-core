import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { useAppSelector } from "@/states/hooks";
import { selectAllPools } from "@/app/states/poolsState";
import { PoolCard } from "@/app/components/cards/poolCard";
import { Zoom } from "react-awesome-reveal";
import { HintBox } from "@/app/components/hintBox";
import { JoinClubButton } from "@/app/components/buttons/joinClubButton";
import { useTranslation } from "next-i18next";
import { AnimatedIconCoins } from "@/app/components/animatedIcons/animatedIconCoins";

interface Props {
  accountData?: AccountData;
}

export const PoolList: FC<Props> = ({ accountData }) => {
  const pools = useAppSelector(selectAllPools);
  const { t } = useTranslation();

  const relevantPools = useMemo(() => {
    if (!accountData) return pools;
    if (accountData && !accountData.balancesPools) return [];
    const accountPoolIds = new Set(accountData.balancesPools.map((p) => p.id));
    return pools.filter((p) => accountPoolIds.has(p.poolId));
  }, [pools, accountData]);

  const hasPools = relevantPools.length > 0;
  return (
    <div>
      {hasPools && (
        <Zoom cascade triggerOnce>
          {relevantPools.map((p) => {
            return (
              <PoolCard
                className="mt-4 bg-gradient-to-r from-base-100 to-secondary isolate"
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
          <div className="w-1/2 mx-auto">
            <JoinClubButton />
          </div>
        </div>
      )}
    </div>
  );
};
