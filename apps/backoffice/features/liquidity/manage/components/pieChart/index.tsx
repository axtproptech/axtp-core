import { Card } from "@mui/material";
import { chartData } from "./chartData";
import dynamic from "next/dynamic";
import { useMasterContract } from "@/app/hooks/useMasterContract";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  loading: () => null,
  ssr: false,
});

export const PieChart = () => {
  const { token } = useMasterContract();
  const [holding, circulating] = [
    parseInt(token.quantity, 10),
    parseInt(token.supply, 10),
  ];
  return (
    <Card sx={{ p: 2, height: "218px" }}>
      {/*@ts-ignore*/}
      <DynamicChart
        {...chartData([holding, circulating], ["Holding", "Circulating"])}
      />
    </Card>
  );
};
