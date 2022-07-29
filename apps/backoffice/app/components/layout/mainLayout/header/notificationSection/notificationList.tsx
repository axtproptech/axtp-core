import { useTheme } from "@mui/material/styles";
import { List } from "@mui/material";

import { FC } from "react";
import { NotificationItem } from "./notificationItem";
import { NotificationType } from "@/types/notificationType";

interface Props {
  notifications: NotificationType[];
}

export const NotificationList: FC<Props> = ({ notifications }) => {
  const theme = useTheme();

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 330,
        py: 0,
        borderRadius: "10px",
        [theme.breakpoints.down("md")]: {
          maxWidth: 300,
        },
        "& .MuiListItemSecondaryAction-root": {
          top: 22,
        },
        "& .MuiDivider-root": {
          my: 0,
        },
        "& .list-container": {
          pl: 7,
        },
      }}
    >
      {notifications.map((n, index) => (
        <NotificationItem key={index} notification={n} />
      ))}
    </List>
  );
};
