import PropTypes from "prop-types";
import { FC, forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { useAppSelector } from "@/states/hooks";
import { selectIsLeftDrawerOpened } from "@/app/states/appState";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  item: any;
  level: number;
}

export const NavItem: FC<Props> = ({ item, level }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const isLeftDrawerOpen = useAppSelector(selectIsLeftDrawerOpened);
  // const customization = useSelector((state) => state.customization);
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

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
      </ListItemButton>
    </Link>
  );
};
