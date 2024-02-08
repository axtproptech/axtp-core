import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "./masterContractInitializer";
import { BurnContractInitializer } from "./burnContractInitializer";
import { PoolsInitializer } from "./poolsInitializer";
import { NotificationsHandler } from "./notificationsHandler/notificationsHandler";

export const AppInitializer = () => {
  return (
    <>
      <WalletInitializer />
      <MasterContractInitializer />
      <BurnContractInitializer />
      <PoolsInitializer />
      <NotificationsHandler />
    </>
  );
};
