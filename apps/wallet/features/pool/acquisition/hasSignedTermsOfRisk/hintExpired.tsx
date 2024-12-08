import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { Button } from "react-daisyui";
import { RiArticleLine } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { AnimatedIconClock } from "@/app/components/animatedIcons/animatedIconClock";

interface Props {
  onSubmit: () => void;
}

export const HintExpired = ({ onSubmit }: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className="mt-[25%] px-4">
      <HintBox>
        <div className="relative">
          <div className="absolute w-[64px] top-[-48px] bg-base-100">
            <AnimatedIconClock loopDelay={5000} touchable />
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="py-4">{t("buy_signed_terms_expired")}</p>
            <Button
              className="w-fit mx-auto animate-wiggle"
              color="primary"
              onClick={onSubmit}
              startIcon={<RiArticleLine />}
            >
              {t("sign_terms_update")}
            </Button>
          </div>
        </div>
      </HintBox>
    </div>
  );
};
