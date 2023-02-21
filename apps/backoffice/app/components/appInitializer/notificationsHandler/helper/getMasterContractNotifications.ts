import { MasterContractData } from "@/types/masterContractData";
import { NotificationType } from "@/types/notificationType";
import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import { isApprovalRequested } from "./isApprovalRequested";

export function getMasterContractNotifications(
  masterContract: MasterContractData
): NotificationType[] {
  const notifications: NotificationType[] = [];
  if (isApprovalRequested(masterContract.approvalStatusBurning)) {
    notifications.push({
      icon: "approval",
      link: "/admin/liquidity",
      title: "Pending Burn Approval",
      message: `There is a pending Liquidity Burning approval of ${masterContract.approvalStatusBurning.quantity} ${masterContract.token.name} for the Master Contract`,
    });
  }

  if (isApprovalRequested(masterContract.approvalStatusSendToPool)) {
    notifications.push({
      icon: "approval",
      link: "/admin/liquidity",
      title: "Pending Send Pool Approval",
      message: `There is a pending Send to Pool Burning approval of ${masterContract.approvalStatusBurning.quantity} ${masterContract.token.name} for the Master Contract`,
    });
  }

  if (isApprovalRequested(masterContract.approvalStatusMinting)) {
    notifications.push({
      icon: "approval",
      link: "/admin/liquidity",
      title: "Pending Mint Approval",
      message: `There is a pending Liquidity Minting approval of ${masterContract.approvalStatusMinting.quantity} ${masterContract.token.name} for the Master Contract`,
    });
  }

  if (isApprovalRequested(masterContract.approvalStatusSendToPool)) {
    notifications.push({
      icon: "approval",
      link: `/admin/liquidity`,
      title: "Pending Liquidity Transfer Approval",
      message: `There is a pending Liquidity Transfer of ${masterContract.approvalStatusSendToPool.quantity} ${masterContract.token.name} for a Pool.`,
    });
  }

  if (
    Amount.fromSigna(masterContract.balance).less(
      Config.MasterContract.LowBalanceThreshold
    )
  ) {
    notifications.push({
      icon: "low-balance",
      link: "/admin/liquidity",
      title: "Low Balance Warning",
      message: "The Master Contract has low balance. Please recharge!",
    });
  }

  return notifications;
}
