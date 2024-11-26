import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { RiFileDownloadLine } from "react-icons/ri";
import { useMemo } from "react";
import { Address } from "@signumjs/core";
import { useAppContext } from "@/app/hooks/useAppContext";
import { HintBox } from "@/app/components/hintBoxes/hintBox";
import { AnimatedIconContract } from "@/app/components/animatedIcons/animatedIconContract";
import { PrintableSeedDocument } from "@/features/account/components/printableSeedDocument";
import { StepLayout } from "../../components/StepLayout";
import { KycFormDataStepProps } from "./kycFormDataStepProps";

export const BlockchainAccountSeed = ({ formData }: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const {
    Ledger: { AddressPrefix },
  } = useAppContext();

  // no need to set the bottom navigation...

  const downloadSeedPhrase = () => {
    window.print();
  };

  const accountRS = useMemo(() => {
    try {
      return Address.fromPublicKey(
        formData.accountPublicKey,
        AddressPrefix
      ).getReedSolomonAddress();
    } catch (e) {
      return "";
    }
  }, [formData.accountPublicKey, AddressPrefix]);

  return (
    <>
      <PrintableSeedDocument
        seed={formData.accountSeedPhrase}
        address={accountRS}
      />
      <StepLayout>
        <section>
          <h3>{t("you_recovery_phrase")}</h3>
          <p className="text-justify">{t("save_seed_phrase_hint")}</p>
        </section>

        <section className="flex flex-col justify-start items-center gap-2 mt-8">
          <span className="text-center font-bold">
            🤫{t("for_your_eyes_only")}🤫
          </span>
          <HintBox>
            <div className="absolute w-[64px] top-[-40px] left-[4px] bg-base-100">
              <AnimatedIconContract loopDelay={500} />
            </div>
            <div className="text-xl mt-2">{formData.accountSeedPhrase}</div>
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
      </StepLayout>
    </>
  );
};
