import { Box, Grid, Typography } from "@mui/material";
import { Config } from "@/app/config";
import { useRouter } from "next/router";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  const {
    query: { poolId },
  } = useRouter();

  // @ts-ignore
  const poolData = useAppSelector(selectPoolContractState(poolId));

  if (!poolData) return null;

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <PoolCard data={poolData} />
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
