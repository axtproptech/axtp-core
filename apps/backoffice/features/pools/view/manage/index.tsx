import { Box, Grid, Typography } from "@mui/material";
import { Config } from "@/app/config";

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/*<LiquidityCard*/}
            {/*  isLoading={isLoading}*/}
            {/*  mintLiquidity={approvalStatusMinting.quantity}*/}
            {/*  burnLiquidity={approvalStatusBurning.quantity}*/}
            {/*  liquidity={token.supply}*/}
            {/*  tokenSymbol={token.name}*/}
            {/*/>*/}
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            {/*<PieChart />*/}
          </Grid>
          <Grid item lg={5} md={6} sm={6} xs={12}>
            {/*<HistoryChart />*/}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            {/*<MintActionCard />*/}
          </Grid>
          <Grid item xs={12} md={8}>
            {/*<MintApprovalCard />*/}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            {/*<BurnActionCard />*/}
          </Grid>
          <Grid item xs={12} md={8}>
            {/*<BurnApprovalCard />*/}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
