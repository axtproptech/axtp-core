import { GridRenderCellParams } from "@mui/x-data-grid";
import { Number } from "@/app/components/number";

export const renderAmountUSD = (params: GridRenderCellParams<string>) => {
  return <Number value={params.value || "0"} suffix="USD" decimals={2} />;
};
