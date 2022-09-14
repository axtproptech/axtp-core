import { TokenInitializer } from "./tokenInitializer";
import { MarketInitializer } from "@/app/components/appInitializer/marketInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";
import { KycInitializer } from "@/app/components/appInitializer/kycInitializer";

export const AppInitializer = () => {
  return (
    <>
      <TokenInitializer />
      <PoolsInitializer />
      <MarketInitializer />
      <KycInitializer />
      {/* if you need to initialize your app then this is a good point to add initilizer components here */}
    </>
  );
};
