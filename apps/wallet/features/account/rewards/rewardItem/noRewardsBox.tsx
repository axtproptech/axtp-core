import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AnimatedIconError } from "@/app/components/animatedIcons/animatedIconError";
import * as React from "react";
import { useTranslation } from "next-i18next";

export const NoRewardsBox = () => {
  const { t } = useTranslation("rewards");
  return (
    <HintBox>
      <div className="absolute w-[64px] bottom-[-24px] right-[12px]">
        <AnimatedIconError loopDelay={1000} />
      </div>
      <div className="text-center">
        <h3 className="my-1">{t("noRewards")}</h3>
        <small>{t("noRewardsHint")}</small>
      </div>
    </HintBox>
  );
};
