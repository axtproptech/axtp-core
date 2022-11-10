import { FC, useMemo } from "react";
import { voidFn } from "@/app/voidFn";
import { PoolContractData } from "@/types/poolContractData";
import { Number } from "@/app/components/number";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { useTranslation } from "next-i18next";
// @ts-ignore
import hashicon from "hashicon";
import { Badge } from "react-daisyui";
import { AttentionSeeker, Zoom } from "react-awesome-reveal";
import { AccountData } from "@/types/accountData";

interface Props {
  poolData: PoolContractData;
  accountData?: AccountData;
  onClick?: (pool: PoolContractData) => void;
  className?: string;
}

export const PoolCard: FC<Props> = ({
  onClick = voidFn,
  className = "",
  poolData,
  accountData,
}) => {
  const { t } = useTranslation();
  const { name } = useAppSelector(selectAXTToken);

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

  const freeSeats = Math.max(
    poolData.maxShareQuantity - poolData.token.numHolders,
    0
  );
  const performance =
    (poolData.grossMarketValue / poolData.nominalLiquidity) * 100 - 100;

  const randomDelay = useMemo(() => {
    return 2_000 + Math.floor(Math.random() * 3_000);
  }, [poolData.poolId]);

  return (
    <div className={className}>
      <div
        className="relative card card-side w-full glass cursor-pointer h-full"
        onClick={() => onClick(poolData)}
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
        <div className="card-body">
          <div className="flex flex-row justify-between items-start">
            <h2 className="card-title mr-2">{poolData.token.name}</h2>
            <h2
              className={`card-title ${
                performance > 0 ? "text-green-400" : "text-red-500"
              }`}
            >
              <Number
                value={performance}
                prefix={performance > 0 ? "+" : "-"}
                suffix="%"
                decimals={2}
              />
            </h2>
          </div>
          <div>
            <div className="flex flex-col justify-between items-start lg:items-end">
              <h2 className="text-lg font-bold">
                <Number value={poolData.grossMarketValue} suffix={name} />
              </h2>
              <Number
                value={poolData.grossMarketValue - poolData.nominalLiquidity}
                prefix="+"
                suffix={name}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <progress
                className="progress progress-info mr-1"
                value={poolData.token.numHolders}
                max={poolData.maxShareQuantity}
              />
              <small>
                {poolData.token.numHolders}/{poolData.maxShareQuantity}
              </small>
            </div>
            <small>
              {freeSeats ? t("free_pool_seats", { freeSeats }) : t("pool_full")}
            </small>
            {accountShares > 0 && (
              <Badge color="secondary" className="absolute bottom-2 right-2">
                {t("you_own_n_shares", { count: accountShares })}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
