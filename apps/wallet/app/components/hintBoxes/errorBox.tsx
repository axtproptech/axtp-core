import { HintBox } from "./hintBox";
import * as React from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { useTranslation } from "next-i18next";

interface Props {
  title?: string;
  text: string;
}

export const ErrorBox = ({ title, text }: Props) => {
  const { t } = useTranslation();
  return (
    <HintBox>
      <div className="absolute w-[64px] bottom-[-48px] right-[12px] bg-base-100">
        <AnimatedIconError loopDelay={3000} />
      </div>
      <div className="text-center">
        <h3 className="my-1">{title ?? t("error_box_title")}</h3>
        <small>{text}</small>
      </div>
    </HintBox>
  );
};
