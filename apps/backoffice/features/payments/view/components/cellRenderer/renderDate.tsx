import { GridRenderCellParams } from "@mui/x-data-grid";
import { toDateStr } from "@/app/toDateStr";

export const renderDate = (params: GridRenderCellParams<string>) => {
  const date = params.value;
  if (!date) return null;
  const applied = toDateStr(new Date(date));
  return <div>{applied}</div>;
};
