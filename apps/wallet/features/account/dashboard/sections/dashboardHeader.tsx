import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { ResponsiveLine, Serie } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";
import { usePortfolioBalance } from "@/app/hooks/usePortfolioBalance";
import { Badge } from "react-daisyui";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { VerificationLevelType } from "@/types/verificationLevelType";
import { VerificationBadge } from "@/app/components/badges/verificationBadge";

interface ChartProps {
  data: Serie;
}

const Chart: FC<ChartProps> = ({ data }) => {
  if (!data.data || !data.data.length) return null;

  return (
    <ResponsiveLine
      data={[data]}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        nice: true,
        stacked: false,
        reverse: false,
      }}
      margin={{ top: 100, bottom: 12 }}
      curve="basis"
      layers={["lines", "areas"]}
      yFormat=" >-.2f"
      lineWidth={4}
      enableArea
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "rgb(220, 165, 76)", opacity: 1 },
          { offset: 1.25, color: "rgb(220, 165, 76)", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      colors={{ datum: "color" }}
      animate
    />
  );
};

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
    axtcTotalBalance,
  } = usePortfolioBalance();
  const { t } = useTranslation();
  const router = useRouter();

  const handleOnClickInactive = async () => {
    await router.push("/account/activate");
  };

  const chartData = useMemo<Serie[] | null>(() => {
    if (!accountData) return null;

    const signaHistory: Serie = {
      id: "signa",
      color: "rgb(157,116,35)",
      data: [],
    };
    const axtHistory: Serie = {
      id: "axt",
      color: "rgb(220, 165, 76)",
      data: [],
    };
    let signa = Number(accountData.balanceSigna);
    let axt = Number(accountData.balanceAxt);
    let i = 0;
    for (let tx of accountData.transactions) {
      if (tx.signa !== undefined) {
        signaHistory.data.push({
          x: i,
          y: signa,
        });
        signa += tx.type === "out" ? tx.signa : -tx.signa;
      }

      if (tx.axt !== undefined) {
        axtHistory.data.push({
          x: i,
          y: axt,
        });
        axt += tx.type === "out" ? tx.axt : -tx.axt;
      }
      ++i;
    }

    if (axt > 0 && axtHistory.data.length === 0) {
      axtHistory.data.push({
        x: 0,
        y: axt,
      });
      axtHistory.data.push({
        x: i - 1,
        y: axt,
      });
    }

    if (signa > 0 && signaHistory.data.length === 0) {
      signaHistory.data.push({
        x: 0,
        y: signa,
      });
      signaHistory.data.push({
        x: i - 1,
        y: signa,
      });
    }
    return [signaHistory, axtHistory];
  }, [accountData]);

  const loadingClassName = chartData ? "" : `blur animate-pulse`;

  return (
    <div className={`h-[240px] relative py-4 ${loadingClassName}`}>
      <div className="absolute top-0 h-[240px] w-full">
        {chartData && <Chart data={chartData[0]} />}
      </div>
      <div className="absolute top-0 h-[240px] w-full">
        {chartData && <Chart data={chartData[1]} />}
      </div>
      <div className="absolute top-0 p-4 w-full">
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
            <h5 className={"text-sm opacity-60"}>~ {fiatBalance.formatted}</h5>
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
