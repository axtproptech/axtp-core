import animation from "./lotties/warnIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconWarn: FC<Omit<AnimatedIconProps, "animationData">> = (
  props
) => <AnimatedIcon animationData={animation} {...props} />;
