import * as React from "react";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import { useTranslation } from "next-i18next";
import { ShortMessageBox } from "./shortMessageBox";

interface Props {
  title?: string;
  text: string;
}

export const ErrorBox = ({ title, text }: Props) => {
  const { t } = useTranslation();
  return (
    <ShortMessageBox
      title={title ?? t("error_box_title")}
      text={text}
      animatedIcon={<AnimatedIconError loopDelay={3000} />}
    />
  );
};
