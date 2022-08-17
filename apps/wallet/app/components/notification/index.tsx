import * as React from "react";

import { useAppSelector } from "@/states/hooks";
import { selectNotificationState } from "@/app/states/appState";
import { useNotification } from "@/app/hooks/useNotification";
import { Alert } from "react-daisyui";
import { AttentionSeeker, Slide } from "react-awesome-reveal";
import { useMemo } from "react";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "react-icons/ri";

export const Notification = () => {
  const notification = useAppSelector(selectNotificationState);
  const { hide } = useNotification();

  const icon = useMemo(() => {
    const Size = 24;
    switch (notification.type) {
      case "success":
        return <RiCheckboxCircleLine size={Size} />;
      case "warning":
        return <RiAlarmWarningLine size={Size} />;
      case "error":
        return <RiErrorWarningLine size={Size} />;
      case "info":
      default:
        return <RiInformationLine size={Size} />;
    }
  }, [notification.type]);

  return (
    <div className="top-2 w-full z-top px-2 absolute">
      <Slide
        direction={notification.shown ? "down" : "up"}
        triggerOnce
        duration={500}
        reverse={!notification.shown}
      >
        <Alert status={notification.type} onClick={hide}>
          <div className="w-full flex flex-row justify-start items-center gap-2">
            <AttentionSeeker effect="heartBeat">{icon}</AttentionSeeker>
            <div>{notification.message}</div>
          </div>
        </Alert>
      </Slide>
    </div>
  );
};
