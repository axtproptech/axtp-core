import { useAppDispatch } from "@/states/hooks";
import { actions } from "@/app//states/appState";
import { useRef } from "react";

export const useNotification = () => {
  const closeTimer = useRef<NodeJS.Timeout>();
  const dispatch = useAppDispatch();

  function hide() {
    closeTimer.current && clearTimeout(closeTimer.current);
    dispatch(actions.hideNotification());
  }

  function show(
    message: string,
    type: "info" | "success" | "warning" | "error" | undefined
  ) {
    closeTimer.current && clearTimeout(closeTimer.current);
    dispatch(
      actions.showNotification({
        type,
        message,
      })
    );
    closeTimer.current = setTimeout(hide, 5_000);
  }

  function showError(e: Error | string) {
    if (e instanceof Error) {
      show(e.message, "error");
    } else {
      show(e, "error");
    }
  }

  function showWarning(msg: string) {
    show(msg, "warning");
  }

  function showSuccess(msg: string) {
    show(msg, "success");
  }

  function showInfo(msg: string) {
    show(msg, "info");
  }

  return {
    hide,
    showError,
    showInfo,
    showSuccess,
    showWarning,
  };
};
