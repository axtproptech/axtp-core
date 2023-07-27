import { HintBox } from "./hintBox";
import { AnimatedIconGlobe } from "../animatedIcons/animatedIconGlobe";
import * as React from "react";

interface Props {
  title: string;
  text: string;
}

export const LoadingBox = ({ title, text }: Props) => (
  <HintBox>
    <div className="absolute w-[64px] bottom-[-48px] right-[12px] bg-base-100">
      <AnimatedIconGlobe loopDelay={1000} />
    </div>
    <div className="text-center">
      <h3 className="my-1">{title}</h3>
      <small>{text}</small>
    </div>
  </HintBox>
);
