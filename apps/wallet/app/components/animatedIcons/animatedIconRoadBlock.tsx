import animation from "./lotties/roadblockIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconRoadBlock: FC<
  Omit<AnimatedIconProps, "animationData">
> = (props) => <AnimatedIcon animationData={animation} {...props} />;
