import { GridRenderCellParams } from "@mui/x-data-grid";

export const renderDate = (params: GridRenderCellParams<string>) => {
  const date = params.value;
  if (!date) return null;
  const applied = new Date(date).toLocaleDateString();
  return <div>{applied}</div>;
};
