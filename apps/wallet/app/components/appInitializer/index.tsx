import { TokenInitializer } from "./tokenInitializer";
import { MarketInitializer } from "@/app/components/appInitializer/marketInitializer";
import { PoolsInitializer } from "@/app/components/appInitializer/poolsInitializer";
import { KycInitializer } from "@/app/components/appInitializer/kycInitializer";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { selectAgreementKey, appSlice } from "@/app/states/appState";

export const AppInitializer = () => {
  const timeoutRef = useRef<any>();
  const { TrackingEventService } = useAppContext();
  const agreementKey = useAppSelector(selectAgreementKey);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const clearTimer = () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };

    if (agreementKey) {
      clearTimer();
      timeoutRef.current = setTimeout(() => {
        dispatch(appSlice.actions.clearAgreementKey());
      }, 30_000);
    }

    return () => {
      clearTimer();
    };
  }, [agreementKey, dispatch]);

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
