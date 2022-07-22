import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useRouter } from "next/router";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { PayoutActionCard } from "./payoutActionCard";
import { PayoutApprovalCard } from "./payoutApprovalCard";
import { singleQueryArg } from "@/app/singleQueryArg";

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  const { query } = useRouter();

  const poolId = singleQueryArg(query.poolId);
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
            <PayoutActionCard poolId={poolId} />
          </Grid>
          <Grid item xs={12} md={8}>
            <PayoutApprovalCard />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
