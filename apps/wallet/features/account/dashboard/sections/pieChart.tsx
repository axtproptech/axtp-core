import { ResponsivePie, DefaultRawDatum } from "@nivo/pie";
import { FC } from "react";
import { formatNumber } from "@/app/formatNumber";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";
import { useAccount } from "@/app/hooks/useAccount";
import { usePortfolioBalance } from "@/app/hooks/usePortfolioBalance";
import { useAppContext } from "@/app/hooks/useAppContext";

export const ChartColors = {
  base: "#dca54c",
  // schema: ["#DCA54C", "#D79833", "#BB8225", "#996A1E", "#775138", "#553B11"],
  schema: [
    "#87d039",
    "#66c6ff",
    "#e2d562",
    "#ff6f6f",
    "#abc9ff",
    "#f9b9e5",
    "#DCA54C",
  ],
};

export interface PieChartDatum extends DefaultRawDatum {
  label: string;
}

interface PieChartsProps {
  data: PieChartDatum[];
}

// @ts-ignore
const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
  const { name } = useAppSelector(selectAXTToken);
  const { signaBalance } = usePortfolioBalance();
  // @ts-ignore
  const total = dataWithArc.reduce((sum, datum) => sum + datum.value, 0);
  const formattedTotal = formatNumber({ value: total });
  const fontSize = 30 - Math.ceil(formattedTotal.length) + "px";

  return (
    <>
      <text
        x={centerX}
        y={centerY - 16}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize,
          fontWeight: 500,
          fill: ChartColors.base,
        }}
      >
        {formattedTotal}
      </text>
      <text
        x={centerX}
        y={centerY + 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontWeight: 500,
          fill: ChartColors.base,
        }}
      >
        {name}
      </text>
      <text
        x={centerX}
        y={centerY + 28}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "12px",
          fontWeight: 500,
          fill: ChartColors.base,
        }}
      >
        {signaBalance.formatted}
      </text>
    </>
  );
};
export const PieChart: FC<PieChartsProps> = ({ data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    innerRadius={0.625}
    padAngle={1}
    animate={true}
    colors={{ datum: "data.color" }}
    layers={["arcs", "arcLabels", CenteredMetric]}
    arcLabel="data.label"
    enableArcLinkLabels={true}
    arcLabelsTextColor={{
      from: "color",
      modifiers: [["brighter", 4]],
    }}
  />
);
