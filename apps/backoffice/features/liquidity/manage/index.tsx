import { Grid, Tab } from "@mui/material";
import { Config } from "@/app/config";
import { LiquidityCard } from "./components/liquidityCard";
import { MintActionCard } from "./components/mintActionCard";
import { BurnActionCard } from "./components/burnActionCard";
import { MintApprovalCard } from "./components/mintApprovalCard";
import { BurnApprovalCard } from "./components/burnApprovalCard";
import { HistoryChart } from "./components/historyChart";
import { PieChart } from "./components/pieChart";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useMemo, useState } from "react";
import { IconFlame, IconSeeding, IconSend } from "@tabler/icons";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { WithBadge } from "@/app/components/withBadge";
import { SendToPoolActionCard } from "@/features/liquidity/manage/components/sendToPoolActionCard";
import { SendToPoolApprovalCard } from "@/features/liquidity/manage/components/sendToPoolApprovalCard";

const gridSpacing = Config.Layout.GridSpacing;

enum Tabs {
  Mint = "mint",
  Send = "send",
  Burn = "burn",
}

export const ManageLiquidity = () => {
  const {
    approvalStatusMinting,
    approvalStatusBurning,
    approvalStatusSendToPool,
    token,
  } = useMasterContract();
  const [currentTab, setCurrentTab] = useState(Tabs.Mint);
  const tokenName = token.name.toUpperCase();

  const handleTabChange = (_event: React.SyntheticEvent, tab: any) => {
    setCurrentTab(tab);
  };

  const isMintingRequested = parseInt(approvalStatusMinting.quantity, 10) > 0;
  const isSendingRequested =
    parseInt(approvalStatusSendToPool.quantity, 10) > 0;
  const isBurningRequested = parseInt(approvalStatusBurning.quantity, 10) > 0;

  const isLoading = false;
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <LiquidityCard
              isLoading={isLoading}
              mintLiquidity={approvalStatusMinting.quantity}
              burnLiquidity={approvalStatusBurning.quantity}
              liquidity={token.supply}
              tokenSymbol={token.name}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <PieChart />
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
        </TabContext>
      </Grid>
    </Grid>
  );
};
