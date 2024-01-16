import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";

export const useAccountRewards = () => {
  const { RewardService } = useAppContext();
  const { accountId } = useAppSelector<AccountState>(
    (state) => state.accountState
  );
  const { data, error } = useSWR(`/fetchAccountRewards/${accountId}`, () =>
    RewardService.fetchRewards(accountId)
  );

  return {
    isLoading: !data && !error,
    rewards: data && !error ? data : [],
    error,
  };
};
