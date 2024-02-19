import { Stats } from "react-daisyui";
import { FC, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { getCompactFormatter } from "@/app/getCompactFormatter";
import { Numeric } from "@/app/components/numeric";

const Stat = Stats.Stat;

interface StatsType {
  totalCurrentGMV: number;
  performancePercent: number;
  shareholderCount: number;
  totalPaidDividends: number;
  poolsCount: number;
}

interface Props {
  stats: StatsType;
}

export const DashboardStats: FC<Props> = ({ stats }) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const compactFormatter = useMemo(
    () => getCompactFormatter(locale || "en"),
    [locale]
  );

  return (
    <div>
      <Stats className="stats-vertical lg:stats-horizontal shadow w-full">
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("total_gmv")}</Stat.Item>
          <Stat.Item variant="value">
            {compactFormatter.format(stats.totalCurrentGMV)}
          </Stat.Item>
          <Stat.Item variant="desc">
            {t("in_n_pools", { count: stats.poolsCount })}
          </Stat.Item>
        </Stat>
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("overall_performance")}</Stat.Item>
          <Stat.Item
            variant="value"
            className={
              stats.performancePercent >= 0 ? "text-green-400" : "text-red-500"
            }
          >
            <Numeric
              value={stats.performancePercent}
              prefix={stats.performancePercent >= 0 ? "+" : "-"}
              suffix="%"
              decimals={2}
            />
          </Stat.Item>
        </Stat>
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("total_paid_divs")}</Stat.Item>
          <Stat.Item variant="value">
            {compactFormatter.format(stats.totalPaidDividends)}
          </Stat.Item>
          <Stat.Item variant="desc">
            {t("to_n_holders", { count: stats.shareholderCount })}
          </Stat.Item>
        </Stat>
      </Stats>
    </div>
  );
};
