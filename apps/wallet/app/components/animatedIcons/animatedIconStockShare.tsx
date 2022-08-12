import animation from "./lotties/stockShareIcon.json";
import { FC } from "react";
import {
  AnimatedIcon,
  AnimatedIconProps,
} from "@/app/components/animatedIcons/animatedIcon";

export const AnimatedIconStockShare: FC<
  Omit<AnimatedIconProps, "animationData">
> = (props) => <AnimatedIcon animationData={animation} {...props} />;
