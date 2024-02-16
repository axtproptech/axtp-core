import { FC } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Badge,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import Link from "next/link";
import { useRouter } from "next/router";
import { selectMenuBadge } from "@/app/states/notificationsState";
import { WithBadge } from "@/app/components/withBadge";
import { useAccount } from "@/app/hooks/useAccount";
import { useAccountPermissions } from "@/app/hooks/useAccountPermissions";

interface Props {
  item: any;
  level: number;
}

export const NavItem: FC<Props> = ({ item, level }) => {
  const theme = useTheme();
  const router = useRouter();
  const menuBadge = useSelector(selectMenuBadge(item.id));
  const { accountId } = useAccount();
  const { permissionRoles } = useAccountPermissions(accountId);

  if (
    item.permissions &&
    !item.permissions.some((p: any) => permissionRoles.includes(p))
  ) {
    return null;
  }

  const isActive = router.asPath === item.url;

  const Icon = item.icon;
  const itemIcon = item?.icon ? (
    <Icon stroke={1.5} size="1.3rem" />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: isActive ? 8 : 6,
        height: isActive ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );

  // let itemTarget = '_self';
  // if (item.target) {
  //     itemTarget = '_blank';
  // }
  //

  return (
    <Link href={item.url} passHref>
      <ListItemButton
        component="a"
        disabled={item.disabled}
        sx={{
          borderRadius: `12px`,
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={isActive}
      >
        <WithBadge value={menuBadge}>
          <ListItemIcon sx={{ my: "auto", minWidth: !item?.icon ? 18 : 36 }}>
            {itemIcon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant={isActive ? "h5" : "body1"} color="inherit">
                {item.title}
              </Typography>
            }
            secondary={
              item.caption && (
                <Typography
                  variant="caption"
                  // @ts-ignore
                  sx={{ ...theme.typography.subMenuCaption }}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )
            }
          />
          {item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </WithBadge>
      </ListItemButton>
    </Link>
  );
};
