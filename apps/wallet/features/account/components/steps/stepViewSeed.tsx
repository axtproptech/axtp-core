import { useTranslation } from "next-i18next";
import { FC } from "react";
import { AnimatedIconWarn } from "@/app/components/animatedIcons/animatedIconWarn";
import { HintBox } from "@/app/components/hintBox";
import { CopyButton } from "@/app/components/buttons/copyButton";
import QRCode from "react-qr-code";
import { TextLogo } from "@/app/components/logo/textLogo";
import { Button } from "react-daisyui";
import { RiFileDownloadLine } from "react-icons/ri";

interface Props {
  seed: string;
  onDownloadClick: () => void;
}

export const StepViewSeed: FC<Props> = ({ seed, onDownloadClick }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full mx-auto">
        <section>
          <h2>{t("your_seed")}</h2>
        </section>
        <section className="relative">
          <div className="relative w-full lg:w-[75%] mx-auto text-justify">
            <div className="border border-base-content p-4 rounded relative text-xl">
              {seed}
            </div>
            <div className="flex flex-row justify-evenly items-center mx-auto px-12 mt-2">
              <CopyButton textToCopy={seed} />
              <Button
                className="ml-4 animate-wiggle"
                onClick={onDownloadClick}
                color="primary"
              >
                <RiFileDownloadLine className="mr-2" />
                {t("download")}
              </Button>
            </div>
          </div>
        </section>
        <section>
          <HintBox text={""}>
            <div className="w-20 m-auto absolute bg-base-100 top-[-48px]">
              <AnimatedIconWarn touchable loopDelay={3000} />
            </div>
            <p>{t("your_seed_hint")}</p>
          </HintBox>
        </section>
      </div>
    </>
  );
};
