import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { usePortfolioBalance } from "@/app/hooks/usePortfolioBalance";
import { useTranslation } from "next-i18next";
import { VerificationLevelType } from "@/types/verificationLevelType";
import { VerificationBadge } from "@/app/components/badges/verificationBadge";
import {
  ChartColors,
  PieChart,
  PieChartDatum,
} from "@/features/account/dashboard/sections/pieChart";
import { Fade } from "react-awesome-reveal";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { selectBrlUsdMarketData } from "@/app/states/marketState";
import { AccountHeader } from "@/features/account/components/accountHeader";

interface Props {
  accountData: AccountData;
  verificationLevel: VerificationLevelType;
}

export const DashboardHeader: FC<Props> = ({
  accountData,
  verificationLevel,
}) => {
  const { axtcBalance, fiatBalance, axtcPoolBalances } = usePortfolioBalance();
  const { name } = useAppSelector(selectAXTToken);
  const brlUsdMarket = useAppSelector(selectBrlUsdMarketData);
  const { t } = useTranslation();

  const chartData = useMemo<PieChartDatum[]>(() => {
    const balances = axtcPoolBalances.map((pb, i) => {
      const color = (i + 1) % ChartColors.schema.length;
      return {
        id: pb.poolTicker,
        value: pb.balance,
        label: pb.poolTicker,
        color: ChartColors.schema[color],
      };
    });

    if (axtcBalance.balance > 0) {
      balances.unshift({
        value: axtcBalance.balance,
        label: t("free"),
        id: "axtc",
        color: ChartColors.schema[0],
      });
    }

    return balances;
  }, [axtcPoolBalances, axtcBalance, t]);

  const loadingClassName = chartData ? "" : "blur animate-pulse";

  return (
    <Fade triggerOnce>
      <section className="pt-12 md:pt-8 flex-row flex mx-auto justify-center">
        <AccountHeader account={accountData} />
      </section>
      <div className={`h-[240px] relative mt-4 p-0 ${loadingClassName}`}>
        <div className="absolute h-[240px] w-full">
          <PieChart data={chartData} />
        </div>
        <div className="absolute w-full">
          <div className="flex flex-row justify-between p-4">
            <div className="flex flex-col">
              <h5 className="text-xs opacity-60 mt-1">
                1 USD = 1 {name.toUpperCase()}
              </h5>
              <h5 className="text-xs opacity-60 mt-1">
                1 USD ≈ {brlUsdMarket.current_price} BRL
              </h5>
            </div>
            <div className="flex flex-col">
              <VerificationBadge verificationLevel={verificationLevel} />
            </div>
          </div>
        </div>
      </div>
      {fiatBalance.balance > 0 && (
        <div className="w-full">
          <h5 className="text-center text-sm opacity-60 ">
            ≈ {fiatBalance.formatted}
          </h5>
        </div>
      )}
    </Fade>
  );
};
