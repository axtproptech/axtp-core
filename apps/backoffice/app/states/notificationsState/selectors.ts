import { RootState } from "@/states/store";
import { NotificationType } from "@/types/notificationType";

export const selectAllNotifications = (state: RootState): NotificationType[] =>
  state.notificationsState.notifications;
