import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { LiquidityCard } from "@/features/liquidity/view/components/liquidityCard";
import { MintActionCard } from "@/features/liquidity/view/components/mintActionCard";
import { BurnActionCard } from "@/features/liquidity/view/components/burnActionCard";
import { MintApprovalCard } from "@/features/liquidity/view/components/mintApprovalCard";
import { BurnApprovalCard } from "@/features/liquidity/view/components/burnApprovalCard";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const HistoryChart = dynamic(
  () => import("./components/dynamicHistoryChart"),

  {
    suspense: true,
    ssr: false,
  }
);

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
            <Suspense fallback="Loading...">
              <HistoryChart />
            </Suspense>
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
