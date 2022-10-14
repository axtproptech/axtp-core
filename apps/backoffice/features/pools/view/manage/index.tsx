import { Grid, Tab } from "@mui/material";
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
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { IconSend } from "@tabler/icons";
import { WithBadge } from "@/app/components/withBadge";
import { useMemo, useState } from "react";
import { Payments } from "@mui/icons-material";
import { pools } from "@/app/components/layout/navigation/pools";

enum PoolTabs {
  Payout = "payout",
  Charge = "charge",
}

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  const { query } = useRouter();
  const { ledgerService } = useLedgerService();
  const [currentTab, setCurrentTab] = useState(PoolTabs.Payout);
  const poolId = singleQueryArg(query.poolId);
  const poolData = useAppSelector(selectPoolContractState(poolId));

  const balanceAmount = useMemo(() => {
    try {
      return Amount.fromSigna(poolData.balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [poolData.balance]);

  if (!poolData) return null;

  const isPayoutRequested =
    parseInt(poolData.approvalStatusDistribution.quantity, 10) > 0;
  const needCharge = balanceAmount.less(
    Config.PoolContract.LowBalanceThreshold
  );

  const handleTabChange = (_event: React.SyntheticEvent, tab: any) => {
    setCurrentTab(tab);
  };

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
          <Grid item lg={4} md={6} sm={12}>
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
        <TabContext value={currentTab}>
          <TabList onChange={handleTabChange}>
            <Tab
              icon={<Payments />}
              label={
                <WithBadge value={isPayoutRequested ? " " : ""}>
                  Dividend Payout
                </WithBadge>
              }
              iconPosition="start"
              value={PoolTabs.Payout}
            />
            <Tab
              icon={<IconSend />}
              label={
                <WithBadge color="error" value={needCharge ? " " : ""}>
                  Charge Contract
                </WithBadge>
              }
              iconPosition="start"
              value={PoolTabs.Charge}
            />
          </TabList>
          <TabPanel value={PoolTabs.Payout} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <PayoutActionCard poolId={poolId} />
              </Grid>
              <Grid item xs={12} md={8}>
                <PayoutApprovalCard poolId={poolId} />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={PoolTabs.Charge} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <ChargeContractCard onRecharge={handleOnRecharge} />
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};
