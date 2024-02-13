export interface NotificationType {
  title: string;
  message: string;
  link: string;
  icon:
    | "approval"
    | "low-balance"
    | "pending-customer"
    | "pending-payment"
    | "pending-withdrawals";
}
