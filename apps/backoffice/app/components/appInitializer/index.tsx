import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "@/app/components/appInitializer/masterContractInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";
import { NotificationsHandler } from "@/app/components/appInitializer/notificationsHandler";

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
