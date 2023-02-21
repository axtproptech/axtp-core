import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "./masterContractInitializer";
import { PoolsInitializer } from "./poolsInitializer";
import { NotificationsHandler } from "./notificationsHandler/notificationsHandler";

export const AppInitializer = () => {
  return (
    <>
      <WalletInitializer />
      <MasterContractInitializer />
      <PoolsInitializer />
      <NotificationsHandler />
    </>
  );
};
