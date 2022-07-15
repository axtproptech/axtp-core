import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useSnackbar } from "@/app/hooks/useSnackbar";

import { useAppSelector } from "@/states/hooks";
import { selectSnackbarState } from "@/app/states/appState";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const SnackBar = () => {
  const snackBarState = useAppSelector(selectSnackbarState);

  const { hideSnackbar } = useSnackbar();

  const open = !!(snackBarState.label && snackBarState.severity);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    hideSnackbar();
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={handleClose}
      action={action}
    >
      <Alert
        onClose={handleClose}
        severity={snackBarState.severity || "success"}
        sx={{ width: "100%" }}
      >
        {snackBarState.label}
      </Alert>
    </Snackbar>
  );
};
