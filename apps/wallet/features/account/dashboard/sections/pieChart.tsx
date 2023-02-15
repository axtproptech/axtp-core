import { ResponsivePie, DefaultRawDatum } from "@nivo/pie";
import { FC } from "react";
import { formatNumber } from "@/app/formatNumber";
import { useAppSelector } from "@/states/hooks";
import { selectAXTToken } from "@/app/states/tokenState";

export const ChartColors = {
  base: "#dca54c",
  schema: ["#DCA54C", "#D79833", "#BB8225", "#996A1E", "#775138", "#553B11"],
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
  // @ts-ignore
  const total = dataWithArc.reduce((sum, datum) => sum + datum.value, 0);
  const formattedTotal = formatNumber({ value: total });
  const fontSize = 30 - Math.ceil(formattedTotal.length) + "px";

  return (
    <>
      <text
        x={centerX}
        y={centerY - 8}
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
        y={centerY + 16}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          fill: ChartColors.base,
        }}
      >
        {name}
      </text>
    </>
  );
};
export const PieChart: FC<PieChartsProps> = ({ data }) => (
  <ResponsivePie
    data={data}
    margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
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
