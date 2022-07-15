import { Card } from "@mui/material";
import { chartData } from "./chartData";
import Chart from "react-apexcharts";

const DynamicHistoryChart = () => {
  return (
    <Card sx={{ p: 2 }}>
      {/*@ts-ignore*/}
      <Chart {...chartData} />
    </Card>
  );
};

export default DynamicHistoryChart;
