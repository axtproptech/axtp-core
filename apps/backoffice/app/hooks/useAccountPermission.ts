import useSWR from "swr";
import { PermissionRole } from "@/types/permissionRole";
import { Config } from "@/app/config";
import { useLedgerService } from "@/app/hooks/useLedgerService";

export const useAccountPermission = (accountId: string = "") => {
  const { ledgerService } = useLedgerService();

  const { data } = useSWR(
    ledgerService && accountId ? `fetchAccountRole/${accountId}` : null,
    async (): Promise<PermissionRole> => {
      let role: PermissionRole = "";
      if (!ledgerService || !accountId) return role;

      if (accountId === Config.Accounts.Principal) {
        role = "master";
      } else if (Config.MasterContract.ApprovalAccounts.includes(accountId)) {
        role = "approver";
      } else {
        const creditorAccounts =
          await ledgerService.burnContract.getCreditorAccounts();
        if (creditorAccounts.includes(accountId)) {
          role = "creditor";
        }
      }
      return role;
    }
  );
  return {
    permissionRole: (data ?? "") as PermissionRole,
  };
};
