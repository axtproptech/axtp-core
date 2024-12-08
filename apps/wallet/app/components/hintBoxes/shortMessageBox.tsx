import { HintBox } from "./hintBox";
import * as React from "react";
import { useTranslation } from "next-i18next";

interface Props {
  title: string;
  text: string;
  animatedIcon: React.ReactElement;
}

export const ShortMessageBox = ({ title, text, animatedIcon }: Props) => {
  const { t } = useTranslation();
  return (
    <HintBox>
      <div className="absolute w-[64px] bottom-[-48px] right-[12px] bg-base-100">
        {animatedIcon}
      </div>
      <div className="text-center">
        <h3 className="my-1">{title}</h3>
        <small>{text}</small>
      </div>
    </HintBox>
  );
};
