import { NotificationType } from "@/types/notificationType";

export function getPendingCustomerNotification(
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
