import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { PendingCustomerTable } from "./components/pendingCustomerTable";

const gridSpacing = Config.Layout.GridSpacing;

export const PendingCustomersOverview = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <PendingCustomerTable />
      </Grid>
    </Grid>
  );
};
