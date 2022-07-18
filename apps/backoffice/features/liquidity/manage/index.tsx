import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { LiquidityCard } from "./components/liquidityCard";
import { MintActionCard } from "./components/mintActionCard";
import { BurnActionCard } from "./components/burnActionCard";
import { MintApprovalCard } from "./components/mintApprovalCard";
import { BurnApprovalCard } from "./components/burnApprovalCard";
import { HistoryChart } from "./components/historyChart";

const gridSpacing = Config.Layout.GridSpacing;

export const ManageLiquidity = () => {
  const isLoading = false;
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LiquidityCard
              isLoading={isLoading}
              mintLiquidity="125.000,00"
              burnLiquidity="0,00"
              liquidity="1.500.000,00"
            />
          </Grid>
          <Grid item lg={8} md={6} sm={6} xs={12}>
            <HistoryChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <MintActionCard />
          </Grid>
          <Grid item xs={12} md={8}>
            <MintApprovalCard />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <BurnActionCard />
          </Grid>
          <Grid item xs={12} md={8}>
            <BurnApprovalCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
