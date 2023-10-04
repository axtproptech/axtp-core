import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { RiFileDownloadLine } from "react-icons/ri";
import { useFormContext } from "react-hook-form";
import { AttentionSeeker } from "react-awesome-reveal";
import { CopyButton } from "@/app/components/buttons/copyButton";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { KycWizard } from "../validation/types";

export const BlockchainAccountSeedVerification = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full max-w-xs mx-auto">
      <section>
        <h3>{t("you_recovery_phrase")}</h3>
        <p className="text-white text-justify font-bold">
          {t("save_seed_phrase_hint")}
        </p>
      </section>

      <section />
    </div>
  );
};
