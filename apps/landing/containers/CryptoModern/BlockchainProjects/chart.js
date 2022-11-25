import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Bar,
  BarChart,
} from "recharts";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

const data = [
  {
    name: "Mid East/Africa",
    2019: 30,
    2020: 10,
    2021: 15,
    2022: 20,
  },
  {
    name: "Latin America",
    2019: 24,
    2020: 20,
    2021: 23,
    2022: 28,
  },
  {
    name: "Asia/Pacific",
    2019: 65,
    2020: 45,
    2021: 62,
    2022: 70,
  },
  {
    name: "North America",
    2019: 145,
    2020: 70,
    2021: 135,
    2022: 165,
  },
  {
    name: "Europe",
    2019: 225,
    2020: 145,
    2021: 160,
    2022: 177,
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
  const p = payload[0].payload;
  return (
    <TooltipStyle>
      <p className="label">{p.name}</p>
      <p className="label">2022: {p["2022"]}</p>
      <p className="label">2021: {p["2021"]}</p>
      <p className="label">2020: {p["2020"]}</p>
      <p className="label">2019: {p["2019"]}</p>
    </TooltipStyle>
  );
};

const Title = styled.div`
  position: relative;
  width: 50%;
  margin: 0 auto;
  top: 4rem;
  text-align: center;
  color: ${themeGet("colors.light")};
  font-weight: bold;
`;

export const Chart = () => (
  <>
    <Title>
      {data.reduce((t, d) => t + d["2022"], 0)}
      <br />
      <small>Global Real Estate Blockchain Products in 2022 </small>
    </Title>
    <ResponsiveContainer>
      <BarChart width={600} height={400} data={data}>
        <XAxis dataKey="name" stroke="white" fontSize={"80%"} />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255, 179, 67, 0.2)" }}
        />
        <Legend />
        <Bar dataKey="2019" fill="rgba(104,50,16,0.6)" />
        <Bar dataKey="2020" fill="rgba(104,50,16,0.9)" />
        <Bar dataKey="2021" fill="rgba(255,179,67,0.6)" />
        <Bar dataKey="2022" fill="rgba(255,179,67,0.9)" />
      </BarChart>
    </ResponsiveContainer>
  </>
);
