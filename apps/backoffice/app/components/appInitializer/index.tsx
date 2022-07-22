import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "@/app/components/appInitializer/masterContractInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";

export const AppInitializer = () => {
  return (
    <>
      <WalletInitializer />
      <MasterContractInitializer />
      <PoolsInitializer />
    </>
  );
};
