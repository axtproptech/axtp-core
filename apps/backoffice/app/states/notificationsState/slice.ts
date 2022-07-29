import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "@/types/notificationType";
interface NotificationsState {
  notifications: NotificationType[];
}

const initialState: NotificationsState = {
  notifications: [],
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications = [...action.payload];
    },
  },
});

export const { actions } = notificationsSlice;
