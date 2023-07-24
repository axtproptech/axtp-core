import { FC, useMemo } from "react";
import { useAccount } from "@/app/hooks/useAccount";
import { Number } from "@/app/components/number";
import { useRouter } from "next/router";
import { PoolContractData } from "@/types/poolContractData";
// @ts-ignore
import hashicon from "hashicon";
import { AttentionSeeker } from "react-awesome-reveal";
import { Stats } from "react-daisyui";
import { getCompactFormatter } from "@/app/getCompactFormatter";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { useAppContext } from "@/app/hooks/useAppContext";

const Stat = Stats.Stat;

interface Props {
  poolData: PoolContractData;
  showStats?: boolean;
}

export const PoolAssetsHeader: FC<Props> = ({
  poolData,
  showStats = false,
}) => {
  const account = useAccount();
  const { t } = useTranslation();

  const axtcToken = useAppSelector(selectAXTToken);

  const stats = useMemo(() => {
    return {
      gmv: poolData.grossMarketValue,
      initial: poolData.nominalLiquidity,
      established: new Date(poolData.created).toLocaleDateString(),
      relGmv:
        (poolData.grossMarketValue / poolData.nominalLiquidity) * 100 - 100,
    };
  }, [poolData]);

  const iconUrl = useMemo(() => {
    if (!poolData) return "";
    return hashicon(poolData.poolId, { size: 64 }).toDataURL();
  }, [poolData]);

  const randomDelay = useMemo(() => {
    return 2_000 + Math.floor(Math.random() * 3_000);
  }, [poolData.poolId]);

  return (
    <div className="relative w-full">
      <section className="p-8 flex-row flex mx-auto justify-center">
        <figure className="w-[64px] flex-col relative mr-8">
          <AttentionSeeker effect="rubberBand" delay={randomDelay}>
            <img src={iconUrl} alt={poolData.token.name} />
          </AttentionSeeker>
          <img
            className="blur-sm scale-y-50 opacity-40 absolute top-12"
            src={iconUrl}
            alt={`${poolData.token.name}-dropshadow`}
          />
        </figure>
        <div className="text-center">
          <h2 className="text-3xl font-bold">{poolData.token.name}</h2>
          <small className="text-sm opacity-80">
            {t("established_on") + " " + stats.established}
          </small>
        </div>
      </section>
      {showStats && (
        <section className="flex flex-row justify-center items-center">
          <div>
            <Stats className="stats-vertical lg:stats-horizontal shadow w-full">
              <Stat className="place-items-center">
                <Stat.Item variant="title">{t("gmv")}</Stat.Item>
                <Stat.Item variant="value">
                  <span>
                    <Number value={stats.gmv} />
                    <small className="ml-1 text-xs">{axtcToken.name}</small>
                  </span>
                </Stat.Item>
                <Stat.Item variant="desc">
                  <Number value={stats.initial} suffix={axtcToken.name} />{" "}
                </Stat.Item>
              </Stat>
              <Stat className="place-items-center">
                <Stat.Item variant="title">{t("performance")}</Stat.Item>
                <Stat.Item variant="value">
                  <span
                    className={
                      stats.relGmv >= 0 ? "text-green-400" : "text-red-500"
                    }
                  >
                    {stats.relGmv >= 0 ? "↗" : "↘"}&nbsp;
                    {stats.relGmv.toFixed(2)}
                    <small className="ml-1 text-xs">%</small>
                  </span>
                </Stat.Item>
                <Stat.Item
                  variant="desc"
                  className={
                    stats.relGmv >= 0 ? "text-green-400" : "text-red-500"
                  }
                >
                  <Number
                    prefix={stats.relGmv >= 0 ? "+" : "-"}
                    value={stats.gmv - stats.initial}
                    suffix={axtcToken.name}
                  />
                </Stat.Item>
              </Stat>
            </Stats>
          </div>
        </section>
      )}
    </div>
  );
};
