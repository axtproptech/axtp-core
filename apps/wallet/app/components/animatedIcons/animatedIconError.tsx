import animation from "./lotties/wowIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconError: FC<Omit<AnimatedIconProps, "animationData">> = (
  props
) => <AnimatedIcon animationData={animation} {...props} />;
