import { WalletInitializer } from "./walletInitializer";
import { MasterContractInitializer } from "@/app/components/appInitializer/masterContractInitializer";

export const AppInitializer = () => {
  return (
    <>
      <WalletInitializer />
      <MasterContractInitializer />
    </>
  );
};
