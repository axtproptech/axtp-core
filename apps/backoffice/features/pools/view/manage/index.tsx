import { Grid, Tab } from "@mui/material";
import { Config } from "@/app/config";
import { useRouter } from "next/router";
import { PoolCard } from "@/features/pools/view/components/poolCard";
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";
import { PayoutApprovalCard } from "./payoutApprovalCard";
import { singleQueryArg } from "@/app/singleQueryArg";
import { ChargeContractCard } from "@/app/components/cards";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { Amount } from "@signumjs/util";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  IconDiscount2,
  IconRecharging,
  IconRocket,
  IconHomeDollar,
  IconUsers,
} from "@tabler/icons";
import { WithBadge } from "@/app/components/withBadge";
import { useMemo, useState } from "react";
import { Payments, Undo } from "@mui/icons-material";
import { UpdateGMVCard } from "@/features/pools/view/manage/updateGMVCard";
import { SendShareToHolderCard } from "@/features/pools/view/manage/sendShareToHolderCard";
import { ShowTokenHolders } from "@/features/pools/view/manage/showTokenHolders";
import { RefundApprovalCard } from "@/features/pools/view/manage/refundApprovalCard";
import { RefundActionCard } from "./refundActionCard";
import { ShowAssets } from "@/features/pools/view/manage/showAssets";

enum PoolTabs {
  Payout = "payout",
  Refund = "refund",
  UpdateGMV = "update-gmv",
  SendToken = "send-token",
  Charge = "charge",
  Holders = "holders",
  Assets = "assets",
}

const gridSpacing = Config.Layout.GridSpacing;

export const ManagePool = () => {
  const { query } = useRouter();
  const { ledgerService } = useLedgerService();
  const poolId = singleQueryArg(query.poolId);
  const action = singleQueryArg(query.action);
  const [currentTab, setCurrentTab] = useState(action || PoolTabs.SendToken);
  const poolData = useAppSelector(selectPoolContractState(poolId));

  const balanceAmount = useMemo(() => {
    if (!poolData) return Amount.Zero();
    try {
      return Amount.fromSigna(poolData.balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [poolData]);

  if (!poolData) return null;

  const isPayoutRequested =
    parseInt(poolData.approvalStatusDistribution.quantity, 10) > 0;
  const isRefundRequested =
    parseInt(poolData.approvalStatusRefund.quantity, 10) > 0;
  const needCharge = balanceAmount.less(
    Config.PoolContract.LowBalanceThreshold
  );

  const ensureLedger = () => {
    if (!ledgerService) {
      throw new Error("No Ledger Service instance available");
    }
    return ledgerService;
  };

  const handleTabChange = (_event: React.SyntheticEvent, tab: any) => {
    setCurrentTab(tab);
  };

  function handleOnRecharge(amount: Amount) {
    return ensureLedger().poolContract.with(poolId).rechargeContract(amount);
  }

  function handleOnUpdateGMV(quantity: number) {
    return ensureLedger()
      .poolContract.with(poolId)
      .updateGrossMarketValue(quantity);
  }

  function handleOnRefund(quantity: number) {
    return ensureLedger().poolContract.with(poolId).requestAXTCRefund(quantity);
  }

  function handleOnSendToHolders(recipientId: string, quantity: number) {
    return ensureLedger()
      .poolContract.with(poolId)
      .sendShareToHolder(recipientId, quantity);
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={6} md={6} sm={12}>
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
              icon={<IconHomeDollar />}
              label={
                <WithBadge color="error" value={needCharge ? " " : ""}>
                  Assets
                </WithBadge>
              }
              iconPosition="start"
              value={PoolTabs.Assets}
            />
            <Tab
              icon={<IconDiscount2 />}
              label="Send Token"
              iconPosition="start"
              value={PoolTabs.SendToken}
            />
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
              icon={<Undo />}
              label={
                <WithBadge value={isRefundRequested ? " " : ""}>
                  Refund {poolData.masterToken.name}
                </WithBadge>
              }
              iconPosition="start"
              value={PoolTabs.Refund}
            />
            <Tab
              icon={<IconRocket />}
              label="Update GMV"
              iconPosition="start"
              value={PoolTabs.UpdateGMV}
            />
            <Tab
              icon={<IconUsers />}
              label={
                <WithBadge color="error" value={needCharge ? " " : ""}>
                  Token Holders
                </WithBadge>
              }
              iconPosition="start"
              value={PoolTabs.Holders}
            />
            <Tab
              icon={<IconRecharging />}
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
              <Grid item xs={12} md={8}>
                <PayoutApprovalCard poolId={poolId} />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={PoolTabs.Refund} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={8}>
                <RefundActionCard onRefund={handleOnRefund} poolId={poolId} />
              </Grid>
              <Grid item xs={12} md={8}>
                <RefundApprovalCard poolId={poolId} />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={PoolTabs.SendToken} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={8}>
                <SendShareToHolderCard
                  onSend={handleOnSendToHolders}
                  poolId={poolId}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={PoolTabs.UpdateGMV} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <UpdateGMVCard
                  onUpdate={handleOnUpdateGMV}
                  currentGMV={poolData.grossMarketValue}
                />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={PoolTabs.Holders} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <ShowTokenHolders poolId={poolId} />
              </Grid>
            </Grid>
          </TabPanel>
          {/*FIXME: we need to separate, as this does not apply for all pools... */}
          <TabPanel value={PoolTabs.Assets} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <ShowAssets poolId={poolId} />
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
