export interface NotificationType {
  shown: boolean;
  message: string;
  type: "info" | "success" | "warning" | "error" | undefined;
}
