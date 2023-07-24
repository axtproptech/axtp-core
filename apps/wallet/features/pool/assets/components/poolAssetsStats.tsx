import { FC, useMemo } from "react";
import { Number } from "@/app/components/number";
// @ts-ignore
import hashicon from "hashicon";
import { Stats } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { AssetAliasMap } from "@axtp/core";
import { useAppContext } from "@/app/hooks/useAppContext";

const Stat = Stats.Stat;

const NoBorderStyle = {
  border: "none",
};

interface Props {
  assetMap: AssetAliasMap;
  collapsed?: boolean;
}

export const PoolAssetsStats: FC<Props> = ({ assetMap, collapsed = false }) => {
  const { t } = useTranslation();
  const { IsMobile } = useAppContext();

  const stats = useMemo(() => {
    let totalMarketValue = 0;
    let totalCosts = 0;
    for (let [_, alias] of assetMap.entries()) {
      const { estimatedMarketValue, accumulatedCosts } = alias.getData();
      totalCosts += accumulatedCosts;
      totalMarketValue += estimatedMarketValue;
    }

    return {
      totalMarketValue,
      totalCosts,
      performance: totalCosts ? (totalMarketValue / totalCosts) * 100 : 0,
    };
  }, [assetMap]);

  const height = IsMobile ? "h-[300px]" : "h-[96px]";
  return (
    <div className="relative w-full">
      <section className="flex flex-row justify-center items-center">
        <div
          className={`transition-[height] overflow-hidden  duration-300 ${
            collapsed ? "h-0" : height
          }`}
        >
          <Stats className={`stats-vertical lg:stats-horizontal shadow w-full`}>
            <Stat className="place-items-center" style={NoBorderStyle}>
              <Stat.Item variant="title">
                {t("total_estimated_value")}
              </Stat.Item>
              <Stat.Item variant="value">
                <span>
                  <Number value={stats.totalMarketValue} decimals={2} />
                  <small className="ml-1 text-xs">USD</small>
                </span>
              </Stat.Item>
            </Stat>
            <Stat className="place-items-center" style={NoBorderStyle}>
              <Stat.Item variant="title">
                {t("total_accumulated_costs")}
              </Stat.Item>
              <Stat.Item variant="value">
                <span>
                  <Number value={stats.totalCosts} decimals={2} />
                  <small className="ml-1 text-xs">USD</small>
                </span>
              </Stat.Item>
            </Stat>
            <Stat className="place-items-center" style={NoBorderStyle}>
              <Stat.Item variant="title">{t("performance")}</Stat.Item>
              <Stat.Item variant="value">
                <span
                  className={
                    stats.performance >= 0 ? "text-green-400" : "text-red-500"
                  }
                >
                  {stats.performance >= 0 ? "↗" : "↘"}&nbsp;
                  {stats.performance.toFixed(2)}
                  <small className="ml-1 text-xs">%</small>
                </span>
              </Stat.Item>
            </Stat>
          </Stats>
        </div>
      </section>
    </div>
  );
};
