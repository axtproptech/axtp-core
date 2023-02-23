import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType } from "@/types/notificationType";

interface NotificationsState {
  notifications: NotificationType[];
  menuBadges: { [key: string]: string };
}

const initialState: NotificationsState = {
  notifications: [],
  menuBadges: {},
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<NotificationType[]>) => {
      state.notifications = [...action.payload];
    },
    setMenuBadge: (
      state,
      action: PayloadAction<{ itemId: string; value: string }>
    ) => {
      const { itemId, value } = action.payload;
      state.menuBadges[itemId] = value;
    },
    reset: () => initialState,
  },
});

export const { actions } = notificationsSlice;
