import { FC, useMemo } from "react";
import { AccountData } from "@/types/accountData";
import { ResponsiveLine, Serie } from "@nivo/line";
import { linearGradientDef } from "@nivo/core";

const ChartSkeleton = () => {
  return (
    <div className="h-full">
      <div>Loading...</div>
    </div>
  );
};

interface ChartProps {
  data: Serie[];
}

const Chart: FC<ChartProps> = ({ data }) => (
  <ResponsiveLine
    data={data}
    yScale={{
      type: "linear",
      min: "auto",
      max: "auto",
      stacked: true,
      reverse: false,
    }}
    margin={{ top: 120, bottom: 12 }}
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
  />
);

interface Props {
  accountData?: AccountData;
}

export const DashboardHeader: FC<Props> = ({ accountData }) => {
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
    for (let tx of accountData.transactions) {
      if (tx.signa !== undefined) {
        signaHistory.data.unshift({
          x: tx.timestamp,
          y: signa,
        });
        signa += tx.type === "out" ? tx.signa : -tx.signa;
      }

      if (tx.axt !== undefined) {
        axtHistory.data.unshift({
          x: tx.timestamp,
          y: axt,
        });
        axt += tx.type === "out" ? tx.axt : -tx.axt;
      }
    }

    const series = [];
    if (signaHistory.data.length) {
      series.push(signaHistory);
    }
    if (axtHistory.data.length) {
      series.push(axtHistory);
    }
    return series;
  }, [accountData]);

  return (
    <div className="h-[240px] relative py-4">
      {chartData ? <Chart data={chartData} /> : <ChartSkeleton />}
      <div className="absolute top-0 p-4 w-full">
        <div className="flex flex-col">
          <h1 className="text-4xl">AXT {accountData?.balanceAxt}</h1>
          <h3 className="text-lg opacity-80">
            SIGNA {accountData?.balanceSigna}
          </h3>
        </div>
      </div>
    </div>
  );
};
