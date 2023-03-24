import { TokenInitializer } from "./tokenInitializer";
import { MarketInitializer } from "@/app/components/appInitializer/marketInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";
import { KycInitializer } from "@/app/components/appInitializer/kycInitializer";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useEffect } from "react";

export const AppInitializer = () => {
  const { TrackingEventService } = useAppContext();

  useEffect(() => {
    TrackingEventService.track({ msg: "Wallet Loaded" });
  }, [TrackingEventService]);

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
