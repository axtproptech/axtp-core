import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Chip } from "@mui/material";

import { IconSettings } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { ProfileMenu } from "@/app/components/Layout/MainLayout/Header/profileSection/profileMenu";
import { Avatar } from "@/app/components/avatar";

export const ProfileSection = () => {
  const theme = useTheme();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((before) => !before);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const email = (session && session.user?.email) || "";

  return (
    <>
      <Chip
        sx={{
          height: "48px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={<Avatar alt={email} />}
        label={
          <IconSettings
            stroke={1.5}
            size="1.5rem"
            color={theme.palette.primary.main}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <ProfileMenu
        anchorElement={anchorRef.current}
        open={open}
        onClose={handleClose}
        userName={email}
      />
    </>
  );
};
