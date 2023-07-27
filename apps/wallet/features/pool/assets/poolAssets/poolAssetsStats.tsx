import { FC, useMemo } from "react";
import { Number } from "@/app/components/number";
import { Stats } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { AssetAliasMap } from "@axtp/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RiFundsLine, RiRefund2Line, RiStockLine } from "react-icons/ri";

const Stat = Stats.Stat;

const NoBorderStyle = {
  border: "none",
};

interface Props {
  assetMap: AssetAliasMap;
  collapsed?: boolean;
}

export const PoolAssetsStats: FC<Props> = ({ assetMap, collapsed = false }) => {
  const { t } = useTranslation("assets");
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
                <span className="flex flex-row items-center gap-x-1">
                  <RiStockLine />
                  <div>{t("total_estimated_value")}</div>
                </span>
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
                <span className="flex flex-row items-center gap-x-1">
                  <RiRefund2Line />
                  <div>{t("total_accumulated_costs")}</div>
                </span>
              </Stat.Item>
              <Stat.Item variant="value">
                <span>
                  <Number value={stats.totalCosts} decimals={2} />
                  <small className="ml-1 text-xs">USD</small>
                </span>
              </Stat.Item>
            </Stat>
            <Stat className="place-items-center" style={NoBorderStyle}>
              <Stat.Item variant="title">
                <span className="flex flex-row items-center gap-x-1">
                  <RiFundsLine />
                  <div>{t("performance")}</div>
                </span>
              </Stat.Item>
              <Stat.Item variant="value">
                <span
                  className={`
                    flex flex-row items-baseline
                    ${
                      stats.performance >= 0 ? "text-green-400" : "text-red-500"
                    }
                  `}
                >
                  <div>{stats.performance >= 0 ? "↗" : "↘"}</div>
                  <Number value={stats.performance} decimals={2} />
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
