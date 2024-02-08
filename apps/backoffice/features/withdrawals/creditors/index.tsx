import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { CreditorsTable } from "./components/creditorsTable";

const gridSpacing = Config.Layout.GridSpacing;

export const Creditors = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <CreditorsTable />
      </Grid>
    </Grid>
  );
};
