import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { CustomerTable } from "@/features/customers/components/customerTable";

const gridSpacing = Config.Layout.GridSpacing;

export const CustomersOverview = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <CustomerTable />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            {/*<TotalGrowthBarChart isLoading={isLoading} />*/}
          </Grid>
          <Grid item xs={12} md={4}>
            {/*<PopularCard isLoading={isLoading} />*/}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
