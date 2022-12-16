import animation from "./lotties/globeIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconGlobe: FC<Omit<AnimatedIconProps, "animationData">> = (
  props
) => <AnimatedIcon animationData={animation} {...props} />;
