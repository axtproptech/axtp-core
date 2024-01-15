import { useAppSelector } from "@/states/hooks";
import { AccountState } from "@/app/states/accountState";
import { useAppContext } from "@/app/hooks/useAppContext";
import useSWR from "swr";
import { mapLedgerTransaction } from "@/app/mapLedgerTransaction";
import {
  selectAllPoolTokens,
  selectAXTToken,
  TokenState,
} from "@/app/states/tokenState";

export const useAccountRewards = () => {
  const { RewardService } = useAppContext();
  const { accountId } = useAppSelector<AccountState>(
    (state) => state.accountState
  );
  const { data, error } = useSWR(
    `/fetchAccountRewards/${accountId}`,
    async () => {
      await RewardService.fetchRewards(accountId);
    }
  );

  return {
    isLoading: !data && !error,
    rewards: data && !error ? data : [],
    error,
  };
};
