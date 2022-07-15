import { Card } from "@mui/material";
import { chartData } from "./chartData";
import Chart from "react-apexcharts";

export const HistoryChart = () => {
  return (
    <Card sx={{ p: 2 }}>
      {/*@ts-ignore*/}
      <Chart {...chartData} />
    </Card>
  );
};
