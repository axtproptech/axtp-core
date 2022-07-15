import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase } from "@mui/material";

import LogoSection from "../logoSection";
import { ProfileSection } from "./profileSection";
import { IconMenu2 } from "@tabler/icons";
import { FC, MouseEventHandler } from "react";

interface Props {
  handleLeftDrawerToggle: MouseEventHandler;
}

export const Header: FC<Props> = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const avatar = {
    // @ts-ignore
    ...theme.typography.commonAvatar,
    // @ts-ignore
    ...theme.typography.mediumAvatar,
  };
  return (
    <>
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...avatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              "&:hover": {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/*<SearchSection />*/}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/*<NotificationSection />*/}
      <ProfileSection />
    </>
  );
};
