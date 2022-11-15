import {
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import { Transition } from "@/app/components/animation";
import { MainCard, WalletConnectorCard } from "@/app/components/cards";
import PerfectScrollbar from "react-perfect-scrollbar";
import { IconLogout, IconSettings, IconUser, IconRecycle } from "@tabler/icons";
import React, { FC, useState } from "react";
import { VirtualElement } from "@popperjs/core";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { adminService } from "@/app/services/adminService";
import { useSnackbar } from "@/app/hooks/useSnackbar";

interface Props {
  anchorElement: VirtualElement;
  open: boolean;
  onClose: (event: any) => void;
  userName: string;
}

export const ProfileMenu: FC<Props> = ({
  open,
  anchorElement,
  onClose,
  userName,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handlePasswordResetRequest = async () => {
    try {
      await adminService.requestPasswordReset();
      showSuccess("Reset requested successfully. Check your email inbox.");
    } catch (e: any) {
      showError("Request failed");
    }
  };

  const handleListItemClick = (
    event: React.MouseEvent,
    index: number,
    route = ""
  ) => {
    setSelectedIndex(index);
    onClose(event);
    if (route && route !== "") {
      router.push(route);
    }
  };

  return (
    <Popper
      placement="bottom-end"
      open={open}
      anchorEl={anchorElement}
      role={undefined}
      transition
      disablePortal
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 14],
            },
          },
        ],
      }}
    >
      {({ TransitionProps }) => (
        <Transition in={open} {...TransitionProps}>
          <Paper>
            <ClickAwayListener onClickAway={onClose}>
              <MainCard
                border={false}
                elevation={16}
                content={false}
                boxShadow
                shadow={theme.shadows[16]}
              >
                <Box sx={{ p: 2 }}>
                  <Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="h4">Howdy,</Typography>
                    </Stack>
                    <Typography variant="h5">{userName}</Typography>
                  </Stack>
                </Box>
                <PerfectScrollbar
                  style={{
                    height: "100%",
                    maxHeight: "calc(100vh - 250px)",
                    overflowX: "hidden",
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <>
                      <Divider />
                      <WalletConnectorCard />
                      <Divider />
                    </>
                    <List
                      component="nav"
                      sx={{
                        width: "100%",
                        maxWidth: 350,
                        minWidth: 300,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "10px",
                        [theme.breakpoints.down("md")]: {
                          minWidth: "100%",
                        },
                        "& .MuiListItemButton-root": {
                          mt: 0.5,
                        },
                      }}
                    >
                      <ListItemButton
                        sx={{ borderRadius: `12px` }}
                        selected={selectedIndex === 4}
                        onClick={() => signOut()}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Logout</Typography>
                          }
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{ borderRadius: `12px` }}
                        selected={selectedIndex === 4}
                        onClick={handlePasswordResetRequest}
                      >
                        <ListItemIcon>
                          <IconRecycle stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              Request Password Reset
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </PerfectScrollbar>
              </MainCard>
            </ClickAwayListener>
          </Paper>
        </Transition>
      )}
    </Popper>
  );
};
