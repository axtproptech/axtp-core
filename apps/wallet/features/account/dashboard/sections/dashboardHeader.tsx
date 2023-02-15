import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { usePortfolioBalance } from "@/app/hooks/usePortfolioBalance";
import { Badge } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { VerificationLevelType } from "@/types/verificationLevelType";
import { VerificationBadge } from "@/app/components/badges/verificationBadge";
import {
  ChartColors,
  PieChart,
  PieChartDatum,
} from "@/features/account/dashboard/sections/pieChart";

interface Props {
  accountData: AccountData;
  verificationLevel: VerificationLevelType;
}

export const DashboardHeader: FC<Props> = ({
  accountData,
  verificationLevel,
}) => {
  const {
    signaBalance,
    axtcBalance,
    fiatBalance,
    axtcReservedBalance,
    axtcPoolBalances,
    axtcTotalBalance,
  } = usePortfolioBalance();
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnClickInactive = async () => {
    await router.push("/account/activate");
  };

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
    <div className={`h-[240px] relative py-4 ${loadingClassName}`}>
      <div className="absolute h-[240px] w-full">
        <PieChart data={chartData} />
      </div>
      <div className="absolute p-4 w-full">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col">
            <h1 className={"text-3xl"}>{axtcTotalBalance.formatted}</h1>
            <div className="flex flex-row">
              <h3 className={"text-sm opacity-80"}>
                {axtcBalance.formatted}&nbsp;{t("free")}&nbsp;
              </h3>
              •
              <h3 className={"text-sm opacity-80"}>
                &nbsp;{axtcReservedBalance.formatted}&nbsp;{t("reserved")}
              </h3>
            </div>
            <h3 className={"text-lg opacity-80"}>{signaBalance.formatted}</h3>
            <h5 className={"text-sm opacity-60"}>≈ {fiatBalance.formatted}</h5>
          </div>
          <div className="flex flex-col">
            {!accountData.isActive && (
              <Badge
                className="my-1 cursor-pointer"
                color="warning"
                onClick={handleOnClickInactive}
              >
                {t("account_unregistered")}
              </Badge>
            )}
            <VerificationBadge verificationLevel={verificationLevel} />
          </div>
        </div>
      </div>
    </div>
  );
};
