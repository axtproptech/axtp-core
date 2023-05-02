import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSystemTheme } from "@/app/getSystemTheme";
import { NotificationType } from "@/types/notificationType";

export interface AppState {
  themeMode: "light" | "dark";
  notification: NotificationType | null;
  agreementKey: string;
}

const initialState: AppState = {
  themeMode: getSystemTheme(),
  notification: null,
  agreementKey: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"dark" | "light">) => {
      state.themeMode = action.payload;
    },
    setAgreementKey: (state, action: PayloadAction<string>) => {
      state.agreementKey = action.payload;
    },
    clearAgreementKey: (state) => {
      state.agreementKey = "";
    },
    showNotification: (
      state,
      action: PayloadAction<Omit<NotificationType, "shown">>
    ) => {
      state.notification = { ...action.payload, shown: true };
    },
    hideNotification: (state) => {
      if (!state.notification) {
        state.notification = {
          shown: false,
          type: undefined,
          message: "",
        };
      }
      state.notification.shown = false;
    },
  },
});

export const { actions } = appSlice;
