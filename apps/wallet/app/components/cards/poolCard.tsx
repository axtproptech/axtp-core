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

interface Props {
  poolData: PoolContractData;
  accountShares?: number;
  onClick?: (pool: PoolContractData) => void;
  className?: string;
}

export const PoolCard: FC<Props> = ({
  onClick = voidFn,
  className = "",
  poolData,
  accountShares = 0,
}) => {
  const { t } = useTranslation();
  const { name } = useAppSelector(selectAXTToken);

  const iconUrl = useMemo(() => {
    if (!poolData) return "";
    return hashicon(poolData.poolId, { size: 64 }).toDataURL();
  }, [poolData]);

  const freeSeats = Math.max(
    poolData.maxShareQuantity - poolData.token.numHolders,
    0
  );
  const performance = (
    ((poolData.paidDistribution + poolData.nominalLiquidity) /
      poolData.nominalLiquidity) *
    100
  ).toFixed(2);
  return (
    <div className={className}>
      <div
        className="card card-side w-full glass cursor-pointer h-full"
        onClick={() => onClick(poolData)}
      >
        <figure className="ml-8 mt-14 w-[64px] flex-col relative">
          <AttentionSeeker effect="rubberBand" triggerOnce delay={5000}>
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
            <div className="flex flex-row items-center">
              <h2 className="card-title mr-2">{poolData.token.name}</h2>
              {accountShares && (
                <Badge color="success" size="lg">
                  {accountShares}
                </Badge>
              )}
            </div>
            <h2 className="card-title text-green-400">
              <Number value={performance} suffix="%" />
            </h2>
          </div>
          <div>
            <div className="flex flex-col justify-between items-end">
              <h2 className="text-lg font-bold">
                <Number value={poolData.nominalLiquidity} suffix={name} />
              </h2>
              <Number
                value={poolData.paidDistribution}
                prefix="+"
                suffix={name}
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <progress
                className="progress progress-info mr-1"
                value={20}
                max={poolData.maxShareQuantity}
              />
              <small>
                {poolData.token.numHolders}/{poolData.maxShareQuantity}
              </small>
            </div>
            <small>
              {freeSeats ? t("free_pool_seats", { freeSeats }) : t("pool_full")}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
