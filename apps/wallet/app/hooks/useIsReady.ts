import { useAppSelector } from "@/states/hooks";

const isRehydrated = (sliceState: any): boolean => {
  return sliceState._persist && sliceState._persist.rehydrated;
};

export const useIsReady = () => {
  return useAppSelector(
    (state) =>
      isRehydrated(state.accountState) &&
      isRehydrated(state.appState) &&
      isRehydrated(state.tokenState) &&
      isRehydrated(state.marketState)
  );
};
