import animation from "./lotties/confettiIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconConfetti: FC<
  Omit<AnimatedIconProps, "animationData">
> = (props) => <AnimatedIcon animationData={animation} {...props} />;
