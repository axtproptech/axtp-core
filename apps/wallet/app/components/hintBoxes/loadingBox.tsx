import { AnimatedIconGlobe } from "../animatedIcons/animatedIconGlobe";
import * as React from "react";
import { ShortMessageBox } from "./shortMessageBox";

interface Props {
  title: string;
  text: string;
}

export const LoadingBox = ({ title, text }: Props) => (
  <ShortMessageBox
    title={title}
    text={text}
    animatedIcon={<AnimatedIconGlobe loopDelay={1000} />}
  />
);
