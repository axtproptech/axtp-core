import { FC, memo } from "react";
import {
  Avatar,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { NotificationType } from "@/types/notificationType";
import { ListItemWrapper } from "./listItemWrapper";
import Link from "next/link";
import { IconCoin, IconUserCheck, IconUserPlus } from "@tabler/icons";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface Props {
  notification: NotificationType;
}

// eslint-disable-next-line react/display-name
export const NotificationItem: FC<Props> = memo(({ notification }) => {
  const icon = {
    approval: <IconUserCheck />,
    "low-balance": <WarningAmberRoundedIcon color="warning" />,
    "pending-customer": <IconUserPlus />,
    "pending-payment": <IconCoin />,
  };

  return (
    <>
      <Link href={notification.link || "#"}>
        <ListItemWrapper>
          <ListItem alignItems="center">
            <ListItemAvatar>
              <Avatar>{icon[notification.icon] || "??"}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={notification.title} />
          </ListItem>
          <Grid container direction="column" className="list-container">
            <Grid item xs={12} sx={{ pb: 2 }}>
              <Typography variant="subtitle2">
                {notification.message}
              </Typography>
            </Grid>
          </Grid>
        </ListItemWrapper>
      </Link>
      <Divider />
    </>
  );
});
