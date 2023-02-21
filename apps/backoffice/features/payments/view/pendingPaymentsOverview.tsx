import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { PendingPaymentsTable } from "./components/pendingPaymentsTable";

const gridSpacing = Config.Layout.GridSpacing;

export const PendingPaymentsOverview = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <PendingPaymentsTable />
      </Grid>
    </Grid>
  );
};
