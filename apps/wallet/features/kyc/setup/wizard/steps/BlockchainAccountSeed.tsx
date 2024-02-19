import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { RiFileDownloadLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { KycWizard } from "../validation/types";
import { HintBox } from "@/app/components/hintBoxes/hintBox";

export const BlockchainAccountSeed = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<KycWizard>();

  const accountSeedPhrase = watch("accountSeedPhrase");

  const downloadSeedPhrase = () => {
    window.print();
  };

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <section>
        <h3>{t("you_recovery_phrase")}</h3>
        <p className="text-justify">{t("save_seed_phrase_hint")}</p>
      </section>

      <section className="flex flex-col justify-start items-center gap-2 mt-8">
        <span className="text-center font-bold">
          🤫 {t("for_your_eyes_only")}🤫
        </span>
        <HintBox>
          <div className="absolute w-[64px] top-[-40px] left-[4px] bg-base-100">
            <AnimatedIconContract loopDelay={500} />
          </div>
          <div className="text-xl mt-2">{accountSeedPhrase}</div>
        </HintBox>
        <div className="w-full flex flex-row items-center justify-between px-4 mt-10">
          <Button
            type="button"
            className="animate-wiggle w-full"
            onClick={downloadSeedPhrase}
            color="warning"
          >
            <RiFileDownloadLine className="mr-2" />
            {t("download")}
          </Button>
        </div>
      </section>
    </div>
  );
};
