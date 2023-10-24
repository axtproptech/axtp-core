import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { RiFileDownloadLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { AttentionSeeker } from "react-awesome-reveal";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { KycWizard } from "../validation/types";

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
        <p className="text-white text-justify font-bold">
          {t("save_seed_phrase_hint")}
        </p>
      </section>

      <section className="flex flex-col justify-start items-center gap-2">
        <div className="w-16 h-16">
          <AttentionSeeker effect="heartBeat">
            <AnimatedIconContract loopDelay={500} />
          </AttentionSeeker>
        </div>

        <div className="border border-base-content p-4 rounded relative text-xl">
          {accountSeedPhrase}
        </div>

        <span className="text-white text-center font-bold">
          🔺 {t("for_your_eyes_only")}🔺
        </span>

        <span className="text-zinc-300 text-center whitespace-pre font-medium">
          {t("copy_seed_recomendation")}
        </span>

        <div className="w-full flex flex-row items-center justify-between px-4">
          <Button
            type="button"
            className="animate-wiggle w-full"
            onClick={downloadSeedPhrase}
            color="primary"
          >
            <RiFileDownloadLine className="mr-2" />
            {t("download")}
          </Button>
        </div>
      </section>

      <section />
    </div>
  );
};
