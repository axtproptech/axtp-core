import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app/states/appState";

type SnackbarType = "error" | "warning" | "info" | "success";

export const useSnackbar = () => {
  const dispatch = useAppDispatch();

  const showSnackbar = (msg: string, type: SnackbarType) => {
    dispatch(
      actions.setSnackbar({
        label: msg,
        severity: type,
      })
    );
  };

  const hideSnackbar = () => {
    dispatch(
      actions.setSnackbar({
        label: "",
        severity: "",
      })
    );
  };

  return {
    showSuccess: (msg: string) => showSnackbar(msg, "success"),
    showInfo: (msg: string) => showSnackbar(msg, "info"),
    showWarning: (msg: string) => showSnackbar(msg, "warning"),
    showError: (msg: string) => showSnackbar(msg, "error"),
    hideSnackbar,
  };
};
