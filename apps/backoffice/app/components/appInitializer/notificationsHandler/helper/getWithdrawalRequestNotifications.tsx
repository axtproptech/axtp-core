import { PoolContractData } from "@/types/poolContractData";
import { NotificationType } from "@/types/notificationType";
import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import { isApprovalRequested } from "./isApprovalRequested";
import { BurnContractData } from "@/types/burnContractData";

export function getWithdrawalRequestNotifications(
  burnContract: BurnContractData
): NotificationType[] {
  const notifications: NotificationType[] = [];

  const withdrawalRequestsCount = burnContract.tokenAccountCredits.reduce(
    (acc, curr) => acc + curr.accountCredits.length,
    0
  );

  if (withdrawalRequestsCount) {
    notifications.push({
      icon: "pending-withdrawals",
      link: `/admin/withdrawals/requests`,
      title: "Pending Withdrawal Requests",
      message: `${withdrawalRequestsCount} pending FIAT withdrawal requests`,
    });
  }
  return notifications;
}
