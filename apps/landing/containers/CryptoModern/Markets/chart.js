import {
  ResponsiveContainer,
  Pie,
  PieChart,
  LabelList,
  Cell,
  Tooltip,
} from "recharts";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const dataInner = [
  {
    name: "Real Estate Europe",
    value: 61.732,
    percent: "17.1%",
    label: "EU",
    color: "rgba(255,179,67,0.6)",
  },
  {
    name: "Real Estate USA",
    value: 61.732,
    percent: "17.1%",
    label: "USA 61.7",
    color: "rgba(255,179,67,0.9)",
  },
  {
    name: "Real Estate Rest",
    value: 157.136,
    color: "rgba(255,179,67,0.3)",
    percent: "43.6%",
  },
  {
    name: "Gold & Silver",
    value: 10.944,
    color: "rgba(104,50,16,0.9)",
    label: "Gold",
    percent: "3%",
  },
  {
    name: "Crypto Assets",
    value: 0.244,
    color: "rgba(104,50,16,0.7)",
    percent: "0.1%",
  },
  {
    name: "Other",
    value: 68.812,
    color: "rgba(104,50,16,0.5)",
    label: "Other",
    percent: "19.1%",
  },
];

const dataOuter = [
  {
    name: "Total Real Estate Wealth",
    value: 280.6,
    color: "rgba(255,179,67,1)",
    percent: "77.8%",
  },
  {
    name: "Total Other Wealth",
    value: 360.6 - 280.6,
    color: "rgba(0,0,0,0)",
    percent: "22.2%",
  },
];

const TooltipStyle = styled.div`
  padding: 0.5rem;
  background-color: rgba(255, 179, 67, 0.7);
  color: ${themeGet("colors.light")};
  border-radius: 4px;
  border: 1px solid ${themeGet("colors.yellow")};
`;

const CustomTooltip = ({ payload, active }) => {
  if (!active) return null;
  const { value, name, percent, description } = payload[0].payload;
  return (
    <TooltipStyle>
      <p className="label">{`${name} : ${value.toFixed(
        1
      )}T USD (${percent})`}</p>
      {/*<p className="desc">{description}</p>*/}
    </TooltipStyle>
  );
};

const Title = styled.div`
  position: relative;
  top: calc(50% + 16px);
  text-align: center;
  color: ${themeGet("colors.light")};
  font-weight: bold;
`;

export const Chart = () => (
  <>
    <Title>
      360.6T
      <br />
      USD
    </Title>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={dataInner}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={50}
          stroke="none"
        >
          {dataInner.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList dataKey="label" fill="#fff" />
        </Pie>
        <Pie
          data={dataOuter}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={110}
          outerRadius={120}
          // fill="#82ca9d"
          stroke="none"
          label
        >
          {dataOuter.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList dataKey="label" fill="#fff" position="outside" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </>
);
