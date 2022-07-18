import { Card } from "@mui/material";
import { chartData } from "./chartData";
import dynamic from "next/dynamic";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  loading: () => null,
  ssr: false,
});

export const HistoryChart = () => {
  return (
    <Card sx={{ p: 2 }}>
      {/*@ts-ignore*/}
      <DynamicChart {...chartData} />
    </Card>
  );
};
