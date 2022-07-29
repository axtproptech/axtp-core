import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useRouter } from "next/router";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { PayoutActionCard } from "./payoutActionCard";
import { PayoutApprovalCard } from "./payoutApprovalCard";
import { singleQueryArg } from "@/app/singleQueryArg";
import { ChargeContractCard } from "@/app/components/cards";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { Amount } from "@signumjs/util";

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  const { query } = useRouter();
  const { ledgerService } = useLedgerService();

  const poolId = singleQueryArg(query.poolId);
  const poolData = useAppSelector(selectPoolContractState(poolId));
  if (!poolData) return null;

  function handleOnRecharge(amount: Amount) {
    if (!ledgerService) {
      throw new Error("No Ledger Service instance available");
    }
    return ledgerService.poolContract.with(poolId).rechargeContract(amount);
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <PoolCard data={poolData} showContractBalance />
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
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={4}>
            <ChargeContractCard onRecharge={handleOnRecharge} />
          </Grid>
          <Grid item xs={12} md={8} />
        </Grid>
      </Grid>
    </Grid>
  );
};
