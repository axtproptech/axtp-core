import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { LiquidityCard } from "@/app/components/cards/liquidityCard";

const gridSpacing = Config.Layout.GridSpacing;

export const Dashboard = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LiquidityCard />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/*<TotalOrderLineChartCard isLoading={isLoading} />*/}
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                {/*<TotalIncomeDarkCard isLoading={isLoading} />*/}
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                {/*<TotalIncomeLightCard isLoading={isLoading} />*/}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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
