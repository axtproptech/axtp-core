import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { CustomerTable } from "./components/customerTable";

const gridSpacing = Config.Layout.GridSpacing;

export const AllCustomersOverview = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <CustomerTable />
      </Grid>
    </Grid>
  );
};
