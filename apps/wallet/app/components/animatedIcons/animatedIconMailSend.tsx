import animation from "./lotties/mailSendIcon.json";
import { FC } from "react";
import { AnimatedIcon, AnimatedIconProps } from "./animatedIcon";

export const AnimatedIconMailSend: FC<
  Omit<AnimatedIconProps, "animationData">
> = (props) => <AnimatedIcon animationData={animation} {...props} />;
