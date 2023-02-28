import { GridRenderCellParams } from "@mui/x-data-grid";

const Days = 1000 * 60 * 60 * 24;

export const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;

  const createdAtDate = new Date(createdAt);
  const overdue =
    params.row.status === "Pending"
      ? Date.now() - createdAtDate.getTime() > 2 * Days
      : false;
  const applied = new Date(createdAt).toLocaleDateString();

  let style = {};
  if (overdue) {
    style = { color: "red", fontWeight: 700 };
  }

  return <div style={style}>{applied}</div>;
};
