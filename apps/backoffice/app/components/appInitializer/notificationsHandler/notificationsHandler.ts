import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { actions } from "@/app/states/notificationsState";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { getMasterContractNotifications } from "./helper/getMasterContractNotifications";
import { getPoolContractNotifications } from "./helper/getPoolContractNotifications";
import { getPendingCustomerNotification } from "./helper/getPendingCustomerNotification";
import { getPendingPaymentNotification } from "./helper/getPendingPaymentNotification";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { getWithdrawalRequestNotifications } from "@/app/components/appInitializer/notificationsHandler/helper/getWithdrawalRequestNotifications";

const Minutes = 1000 * 60;

export const NotificationsHandler = () => {
  const masterContract = useMasterContract();
  const burnContract = useBurnContract();
  const pools = useAppSelector((rootState) => rootState.poolsState.pools);
  const dispatch = useAppDispatch();

  const { data: pendingCustomers } = useSWR(
    "getPendingTokenHolders",
    async () => {
      const pending = await customerService.fetchPendingCustomers();

      dispatch(
        actions.setMenuBadge({
          itemId: "manage-pending-customers",
          value: pending.customers.length
            ? String(pending.customers.length)
            : "",
        })
      );

      return pending;
    },
    {
      refreshInterval: 5 * Minutes,
    }
  );

  const { data: pendingPayments } = useSWR(
    "getPendingPayments",
    async () => {
      const pending = await paymentsService.fetchPendingPayments();

      dispatch(
        actions.setMenuBadge({
          itemId: "manage-pending-payments",
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

    if (burnContract) {
      const pendingRequests = burnContract.tokenAccountCredits.reduce(
        (acc, curr) => acc + curr.accountCredits.length,
        0
      );
      dispatch(
        actions.setMenuBadge({
          itemId: "manage-withdrawals-requests",
          value: pendingRequests ? String(pendingRequests) : "",
        })
      );
      notifications.push(...getWithdrawalRequestNotifications(burnContract));
    }

    if (pools) {
      notifications.push(
        // @ts-ignore
        ...Object.values(pools).flatMap(getPoolContractNotifications)
      );
    }

    if (pendingCustomers?.customers.length) {
      notifications.push(
        getPendingCustomerNotification(pendingCustomers.customers.length)
      );
    }

    if (pendingPayments?.length) {
      notifications.push(getPendingPaymentNotification(pendingPayments.length));
    }

    dispatch(actions.setNotifications(notifications));
  }, [
    dispatch,
    masterContract,
    pools,
    pendingCustomers,
    pendingPayments,
    burnContract,
  ]);

  return null;
};
