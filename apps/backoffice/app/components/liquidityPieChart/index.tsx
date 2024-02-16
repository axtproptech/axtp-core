import { Card } from "@mui/material";
import { chartData } from "./chartData";
import dynamic from "next/dynamic";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useBurnContract } from "@/app/hooks/useBurnContract";

const DynamicChart = dynamic(() => import("react-apexcharts"), {
  loading: () => null,
  ssr: false,
});

export const LiquidityPieChart = () => {
  const { token } = useMasterContract();
  const { getWithdrawnAmount } = useBurnContract();

  const [holding, supply, withdrawn] = [
    parseFloat(token.balance),
    parseFloat(token.supply),
    parseFloat(getWithdrawnAmount(token.id)?.getCompound() || "0"),
  ];

  return (
    <Card sx={{ p: 2, height: "218px" }}>
      {/*@ts-ignore*/}
      <DynamicChart
        {...chartData(
          [holding, supply - holding, withdrawn],
          ["Holding", "Circulating", "Withdrawn"]
        )}
      />
    </Card>
  );
};
