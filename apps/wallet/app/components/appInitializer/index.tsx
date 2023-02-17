import { TokenInitializer } from "./tokenInitializer";
import { MarketInitializer } from "@/app/components/appInitializer/marketInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";
import { KycInitializer } from "@/app/components/appInitializer/kycInitializer";
import { useEffect } from "react";
import { log } from "next-axiom";

export const AppInitializer = () => {
  useEffect(() => {
    log.info("[Frontend] - Appinitializer started");
  }, []);

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
