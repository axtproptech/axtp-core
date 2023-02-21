import { NotificationType } from "@/types/notificationType";

export function getPendingPaymentNotification(
  pendingCount: number
): NotificationType {
  return {
    icon: "pending-payment",
    link: `/admin/payments/pending`,
    title: pendingCount > 1 ? "💸 New Payments" : "💸 New Payment",
    message:
      pendingCount > 1
        ? `${pendingCount} new payments are waiting for processing`
        : `A new payment is waiting for processing`,
  };
}
