import { Stats } from "react-daisyui";
import { FC, useMemo } from "react";
import { useTranslation } from "next-i18next";

const Stat = Stats.Stat;

interface StatsType {
  initialShareholderValue: number;
  shareholderCount: number;
  paidDividends: number;
  poolsCount: number;
}

interface Props {
  stats: StatsType;
}

const compactFormatter = Intl.NumberFormat("en", { notation: "compact" });

export const DashboardStats: FC<Props> = ({ stats }) => {
  const { t } = useTranslation();

  const performance = stats.initialShareholderValue
    ? ((stats.initialShareholderValue + stats.paidDividends) /
        stats.initialShareholderValue) *
        100 -
      100
    : 0;
  return (
    <div>
      <Stats className="stats-vertical lg:stats-horizontal shadow w-full">
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("total_shv")}</Stat.Item>
          <Stat.Item variant="value">
            {compactFormatter.format(
              stats.initialShareholderValue + stats.paidDividends
            )}
          </Stat.Item>
          <Stat.Item variant="desc">
            {t("in_n_pools", { count: stats.poolsCount })}
          </Stat.Item>
        </Stat>
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("total_paid_divs")}</Stat.Item>
          <Stat.Item variant="value">
            {compactFormatter.format(stats.paidDividends)}
          </Stat.Item>
          <Stat.Item variant="desc">
            {t("to_n_holders", { count: stats.shareholderCount })}
          </Stat.Item>
        </Stat>
        <Stat className="place-items-center">
          <Stat.Item variant="title">{t("overall_performance")}</Stat.Item>
          <Stat.Item variant="value" className="text-success">
            {performance.toFixed(2)} %{" "}
          </Stat.Item>
        </Stat>
      </Stats>
    </div>
  );
};
