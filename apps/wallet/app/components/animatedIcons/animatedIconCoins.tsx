import animation from "./lotties/coinsIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconCoins: FC<Omit<AnimatedIconProps, "animationData">> = (
  props
) => <AnimatedIcon animationData={animation} {...props} />;
