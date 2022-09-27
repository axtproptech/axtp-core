import { RootState } from "@/states/store";
import { NotificationType } from "@/types/notificationType";

export const selectAllNotifications = (state: RootState): NotificationType[] =>
  state.notificationsState.notifications;

export const selectMenuBadge =
  (itemId: string) =>
  (state: RootState): string =>
    state.notificationsState.menuBadges[itemId] || "";
