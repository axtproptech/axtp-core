import * as React from "react";

import { useAppSelector } from "@/states/hooks";
import { selectNotificationState } from "@/app/states/appState";
import { useNotification } from "@/app/hooks/useNotification";
import { Alert } from "react-daisyui";
import { AttentionSeeker, Slide } from "react-awesome-reveal";
import { useEffect, useMemo, useState } from "react";
import {
  RiAlarmWarningLine,
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "react-icons/ri";

enum ShowState {
  NotVisible,
  Entering,
  Leaving,
}

const AnimationDuration = 300;

export const Notification = () => {
  const notification = useAppSelector(selectNotificationState);
  const { hide } = useNotification();
  const [showState, setShowState] = useState(ShowState.NotVisible);

  const icon = useMemo(() => {
    if (!notification) return null;

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
  }, [notification]);

  useEffect(() => {
    if (!notification) {
      setShowState(ShowState.NotVisible);
      return;
    }

    if (notification.shown) {
      setShowState(ShowState.Entering);
    } else {
      setShowState((prevState) => {
        if (prevState === ShowState.Entering) {
          setTimeout(() => {
            setShowState(ShowState.NotVisible);
          }, AnimationDuration + 100);
          return ShowState.Leaving;
        }
        return ShowState.NotVisible;
      });
    }
  }, [notification]);

  if (showState === ShowState.NotVisible) return null;

  return (
    <div className="top-2 w-full z-top px-2 absolute">
      <Slide
        direction={showState === ShowState.Entering ? "down" : "up"}
        duration={AnimationDuration}
        reverse={showState === ShowState.Leaving}
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
