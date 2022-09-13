import animation from "./lotties/contractIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconContract: FC<
  Omit<AnimatedIconProps, "animationData">
> = (props) => <AnimatedIcon animationData={animation} {...props} />;
