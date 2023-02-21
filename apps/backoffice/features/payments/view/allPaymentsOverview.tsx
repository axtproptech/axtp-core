import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { PaymentsTable } from "./components/paymentsTable";

const gridSpacing = Config.Layout.GridSpacing;

export const AllPaymentsOverview = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <PaymentsTable />
      </Grid>
    </Grid>
  );
};
