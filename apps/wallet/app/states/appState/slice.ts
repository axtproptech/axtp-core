import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSystemTheme } from "@/app/getSystemTheme";
import { NotificationType } from "@/types/notificationType";

export interface AppState {
  themeMode: "light" | "dark";
  notification: NotificationType;
}

const initialState: AppState = {
  themeMode: getSystemTheme(),
  notification: {
    message: "test notification",
    type: "info",
    shown: false,
  },
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.themeMode = action.payload;
    },
    showNotification: (
      state,
      action: PayloadAction<Omit<NotificationType, "shown">>
    ) => {
      state.notification = { ...action.payload, shown: true };
    },
    hideNotification: (state) => {
      state.notification.shown = false;
    },
  },
});

export const { actions } = appSlice;
