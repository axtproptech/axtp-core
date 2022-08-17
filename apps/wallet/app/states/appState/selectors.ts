import { RootState } from "@/states/store";
import { createSelector } from "@reduxjs/toolkit";
import { NotificationType } from "@/types/notificationType";

export const selectThemeMode = (state: RootState): "dark" | "light" =>
  state.appState.themeMode;

export const selectIsDarkMode = createSelector(
  selectThemeMode,
  (mode) => mode === "dark"
);

export const selectNotificationState = (state: RootState): NotificationType =>
  state.appState.notification;
