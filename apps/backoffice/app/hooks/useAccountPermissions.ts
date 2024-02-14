import useSWR from "swr";
import { PermissionRole } from "@/types/permissionRole";
import { Config } from "@/app/config";
import { useLedgerService } from "@/app/hooks/useLedgerService";

export const useAccountPermissions = (accountId: string = "") => {
  const { ledgerService } = useLedgerService();

  const { data } = useSWR(
    ledgerService && accountId ? `fetchAccountRole/${accountId}` : null,
    async (): Promise<PermissionRole[]> => {
      let roles: PermissionRole[] = [];
      if (!ledgerService || !accountId) return roles;

      if (accountId === Config.Accounts.Principal) {
        roles.push("master");
      }

      if (Config.MasterContract.ApprovalAccounts.includes(accountId)) {
        roles.push("approver");
      }

      const creditorAccounts =
        await ledgerService.burnContract.getCreditorAccounts();
      if (creditorAccounts.includes(accountId)) {
        roles.push("creditor");
      }

      return roles;
    }
  );

  return {
    permissionRoles: (data ?? []) as PermissionRole[],
  };
};
