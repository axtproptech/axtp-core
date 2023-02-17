import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { actions } from "@/app/states/notificationsState";
import { ApprovalStatus } from "@/types/approvalStatus";
import { NotificationType } from "@/types/notificationType";
import { MasterContractData } from "@/types/masterContractData";
import { PoolContractData } from "@/types/poolContractData";
import { Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { CustomerResponse } from "@/bff/types/customerResponse";

const isApprovalRequested = (status: ApprovalStatus) =>
  parseInt(status.quantity, 10) > 0;

function getMasterContractNotifications(
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

function getPoolContractNotifications(
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

function getPendingCustomerNotification(
  pendingCount: number
): NotificationType {
  return {
    icon: "pending-customer",
    link: `/admin/customers/pending`,
    title: pendingCount > 1 ? "🎉 New Customers" : "🎉 New Customer",
    message:
      pendingCount > 1
        ? `${pendingCount} new customers are waiting for verification`
        : `A new customer is waiting for verification`,
  };
}

const Minutes = 1000 * 60;

export const NotificationsHandler = () => {
  const masterContract = useMasterContract();
  const pools = useAppSelector((rootState) => rootState.poolsState.pools);
  const dispatch = useAppDispatch();

  const { data: pendingCustomers } = useSWR(
    "getPendingTokenHolders",
    async () => {
      const pending = await customerService.fetchPendingCustomers();

      dispatch(
        actions.setMenuBadge({
          itemId: "manage-pending-customers",
          value: pending.length ? String(pending.length) : "",
        })
      );

      return pending;
    },
    {
      refreshInterval: 5 * Minutes,
    }
  );

  useEffect(() => {
    const notifications = [];
    if (masterContract) {
      notifications.push(...getMasterContractNotifications(masterContract));
    }

    if (pools) {
      notifications.push(
        // @ts-ignore
        ...Object.values(pools).flatMap(getPoolContractNotifications)
      );
    }

    if (pendingCustomers?.length) {
      notifications.push(
        getPendingCustomerNotification(pendingCustomers.length)
      );
    }

    dispatch(actions.setNotifications(notifications));
  }, [dispatch, masterContract, pools, pendingCustomers]);

  return null;
};
