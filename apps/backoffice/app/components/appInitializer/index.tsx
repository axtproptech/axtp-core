import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "./masterContractInitializer";
import { BurnContractInitializer } from "./burnContractInitializer";
import { PoolsInitializer } from "./poolsInitializer";
import { NotificationsHandler } from "./notificationsHandler/notificationsHandler";
import { MarketDataInitializer } from "./marketDataInitializer";
import React from "react";

const _AppInitializer = () => {
  return (
    <>
      <WalletInitializer />
      <MasterContractInitializer />
      <BurnContractInitializer />
      <PoolsInitializer />
      <NotificationsHandler />
      <MarketDataInitializer />
    </>
  );
};

export const AppInitializer = React.memo(_AppInitializer);
