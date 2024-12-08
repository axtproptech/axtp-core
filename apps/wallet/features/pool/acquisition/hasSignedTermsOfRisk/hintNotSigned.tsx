import { Button } from "react-daisyui";
import { RiArticleLine } from "react-icons/ri";
import { useTranslation } from "next-i18next";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";

interface Props {
  onSubmit: () => void;
}

export const HintNotSigned = ({ onSubmit }: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className="mt-[25%] px-4">
      <HintBox>
        <div className="relative">
          <div className="absolute w-[64px] top-[-48px] bg-base-100">
            <AnimatedIconContract loopDelay={5000} touchable />
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="py-4">{t("buy_terms_not_signed")}</p>
            <Button
              className="w-fit mx-auto animate-wiggle"
              color="primary"
              onClick={onSubmit}
              startIcon={<RiArticleLine />}
            >
              {t("sign_terms")}
            </Button>
          </div>
        </div>
      </HintBox>
    </div>
  );
};
