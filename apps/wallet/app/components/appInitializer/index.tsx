import { TokenInitializer } from "./tokenInitializer";
import { MarketInitializer } from "@/app/components/appInitializer/marketInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";

export const AppInitializer = () => {
  return (
    <>
      <TokenInitializer />
      <PoolsInitializer />
      <MarketInitializer />
      {/* if you need to initialize your app then this is a good point to add initilizer components here */}
    </>
  );
};
