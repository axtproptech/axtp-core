import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { LiquidityCard } from "@/app/components/cards/liquidityCard";
import { BurnContractCard } from "@/app/components/cards/burnContractCard";
import { LiquidityPieChart } from "@/app/components/liquidityPieChart";

const gridSpacing = Config.Layout.GridSpacing;

export const WithdrawalsDashboard = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <BurnContractCard />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LiquidityCard />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <LiquidityPieChart />
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
