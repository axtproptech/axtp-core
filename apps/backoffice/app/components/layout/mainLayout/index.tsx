import { FC, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  useMediaQuery,
} from "@mui/material";

import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { actions } from "@/app/states/appState";
import { selectIsLeftDrawerOpened } from "@/app/states/appState";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { Config } from "@/app/config";
import { ChildrenProps } from "@/types/ChildrenProps";

export const drawerWidth = Config.Layout.DrawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  // @ts-ignore
  ({ theme, open }) => ({
    // @ts-ignore
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("md")]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
        width: `calc(100% - ${drawerWidth}px)`,
        padding: "16px",
        marginRight: "10px",
      },
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down("md")]: {
        marginLeft: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
      },
    }),
  })
);

export const MainLayout: FC<ChildrenProps> = ({ children }) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));
  const leftDrawerOpened = useAppSelector(selectIsLeftDrawerOpened);
  const dispatch = useAppDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch(actions.setIsLeftDrawerOpened(!leftDrawerOpened));
  };

  useEffect(() => {
    dispatch(actions.setIsLeftDrawerOpened(!matchDownMd));
  }, [matchDownMd]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      <Sidebar
        drawerOpen={leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* @ts-ignore */}
      <Main theme={theme} open={leftDrawerOpened}>
        {/* breadcrumb */}
        {/*<Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />*/}
        {/*<Outlet />*/}
        {children}
      </Main>
    </Box>
  );
};
