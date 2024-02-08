import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { WithdrawalRequestsTable } from "./components/withdrawalRequestsTable";

const gridSpacing = Config.Layout.GridSpacing;

export const WithdrawalRequests = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <WithdrawalRequestsTable />
      </Grid>
    </Grid>
  );
};
