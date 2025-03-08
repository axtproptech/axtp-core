import { Grid, Tab } from "@mui/material";
import { Config } from "@/app/config";
import { MintActionCard } from "./components/mintActionCard";
import { BurnActionCard } from "./components/burnActionCard";
import { MintApprovalCard } from "./components/mintApprovalCard";
import { BurnApprovalCard } from "./components/burnApprovalCard";
import { HistoryChart } from "./components/historyChart";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { LiquidityCard } from "@/app/components/cards/liquidityCard";
import { useMemo, useState } from "react";
import {
  IconFlame,
  IconRecharging,
  IconSeeding,
  IconSend,
} from "@tabler/icons";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { WithBadge } from "@/app/components/withBadge";
import { SendToPoolActionCard } from "./components/sendToPoolActionCard";
import { SendToPoolApprovalCard } from "./components/sendToPoolApprovalCard";
import { ChargeContractCard } from "./components/chargeContractCard";
import { Amount } from "@signumjs/util";
import { LiquidityPieChart } from "@/app/components/liquidityPieChart";

const gridSpacing = Config.Layout.GridSpacing;

enum Tabs {
  Mint = "mint",
  Send = "send",
  Burn = "burn",
  Charge = "charge",
}

export const ManageLiquidity = () => {
  const {
    approvalStatusMinting,
    approvalStatusBurning,
    approvalStatusSendToPool,
    token,
    balance,
  } = useMasterContract();
  const [currentTab, setCurrentTab] = useState(Tabs.Mint);
  const tokenName = token.name.toUpperCase();

  const handleTabChange = (_event: React.SyntheticEvent, tab: any) => {
    setCurrentTab(tab);
  };

  const balanceAmount = useMemo(() => {
    try {
      return Amount.fromSigna(balance);
    } catch (e) {
      return Amount.Zero();
    }
  }, [balance]);

  const isMintingRequested = parseInt(approvalStatusMinting.quantity, 10) > 0;
  const isSendingRequested =
    parseInt(approvalStatusSendToPool.quantity, 10) > 0;
  const isBurningRequested = parseInt(approvalStatusBurning.quantity, 10) > 0;
  const needCharge = balanceAmount.less(
    Config.MasterContract.LowBalanceThreshold
  );

  const isLoading = false;
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LiquidityCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <LiquidityPieChart />
          </Grid>
          <Grid item lg={5} md={6} sm={6} xs={12}>
            <HistoryChart />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={currentTab}>
          <TabList onChange={handleTabChange}>
            <Tab
              icon={<IconSeeding />}
              label={
                <WithBadge
                  value={isMintingRequested ? " " : ""}
                >{`Mint ${tokenName}`}</WithBadge>
              }
              iconPosition="start"
              value={Tabs.Mint}
            />
            <Tab
              icon={<IconSend />}
              label={
                <WithBadge
                  value={isSendingRequested ? " " : ""}
                >{`Send ${tokenName} to Pool`}</WithBadge>
              }
              iconPosition="start"
              value={Tabs.Send}
            />
            <Tab
              icon={<IconFlame />}
              label={
                <WithBadge
                  value={isBurningRequested ? " " : ""}
                >{`Burn ${tokenName}`}</WithBadge>
              }
              iconPosition="start"
              value={Tabs.Burn}
            />
            <Tab
              icon={<IconRecharging />}
              label={
                <WithBadge color="error" value={needCharge ? " " : ""}>
                  Charge Contract
                </WithBadge>
              }
              iconPosition="start"
              value={Tabs.Charge}
            />
          </TabList>
          <TabPanel value={Tabs.Mint} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <MintActionCard />
              </Grid>
              <Grid item xs={12} md={8}>
                <MintApprovalCard />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={Tabs.Send} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <SendToPoolActionCard />
              </Grid>
              <Grid item xs={12} md={8}>
                <SendToPoolApprovalCard />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={Tabs.Burn} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <BurnActionCard />
              </Grid>
              <Grid item xs={12} md={8}>
                <BurnApprovalCard />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={Tabs.Charge} sx={{ p: 0, pt: 1 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} md={4}>
                <ChargeContractCard />
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};
