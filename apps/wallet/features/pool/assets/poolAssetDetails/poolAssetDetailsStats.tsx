import { FC } from "react";
import { Number } from "@/app/components/number";
import { Stats } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { AssetAlias } from "@axtp/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { RiFundsLine, RiRefund2Line, RiStockLine } from "react-icons/ri";
import { formatNumber } from "@/app/formatNumber";

const Stat = Stats.Stat;

const NoBorderStyle = {
  border: "none",
};

interface Props {
  assetAlias: AssetAlias;
  collapsed?: boolean;
}

export const PoolAssetDetailsStats: FC<Props> = ({
  assetAlias,
  collapsed = false,
}) => {
  const { t } = useTranslation("assets");
  const { IsMobile } = useAppContext();

  const { estimatedMarketValue, accumulatedCosts } = assetAlias.getData();
  const performance = accumulatedCosts
    ? (estimatedMarketValue / accumulatedCosts) * 100
    : 0;

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
                  <div>{t("asset_estimated_value")}</div>
                </span>
              </Stat.Item>
              <Stat.Item variant="value">
                <span>
                  <Number value={estimatedMarketValue} decimals={2} />
                  <small className="ml-1 text-xs">USD</small>
                </span>
              </Stat.Item>
            </Stat>
            <Stat className="place-items-center" style={NoBorderStyle}>
              <Stat.Item variant="title">
                <span className="flex flex-row items-center gap-x-1">
                  <RiRefund2Line />
                  <div>{t("asset_accumulated_costs")}</div>
                </span>
              </Stat.Item>
              <Stat.Item variant="value">
                <span>
                  <Number value={accumulatedCosts} decimals={2} />
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
                    ${performance >= 0 ? "text-green-400" : "text-red-500"}
                  `}
                >
                  <div>{performance >= 0 ? "↗" : "↘"}</div>
                  <Number value={performance} decimals={2} />
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
