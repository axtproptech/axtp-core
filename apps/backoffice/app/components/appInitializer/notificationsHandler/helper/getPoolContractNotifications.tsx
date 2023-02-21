import { PoolContractData } from "@/types/poolContractData";
import { NotificationType } from "@/types/notificationType";
import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import { isApprovalRequested } from "./isApprovalRequested";

export function getPoolContractNotifications(
  poolContract: PoolContractData
): NotificationType[] {
  const notifications: NotificationType[] = [];

  if (
    Amount.fromSigna(poolContract.balance).less(
      Config.PoolContract.LowBalanceThreshold
    )
  ) {
    notifications.push({
      icon: "low-balance",
      link: `/admin/pools/${poolContract.poolId}`,
      title: "Low Balance Warning",
      message: `Pool Contract [${poolContract.token.name}] has low balance. Please recharge!`,
    });
  }

  if (isApprovalRequested(poolContract.approvalStatusDistribution)) {
    notifications.push({
      icon: "approval",
      link: `/admin/pools/${poolContract.poolId}`,
      title: "Pending Dividend Payout Approval",
      message: `There is a pending Dividend Payout approval for Pool [${poolContract.token.name}]`,
    });
  }

  return notifications;
}
