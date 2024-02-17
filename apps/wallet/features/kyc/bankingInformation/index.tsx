import { useTranslation } from "next-i18next";
import { Controller, useForm } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { validatePixKey } from "@axtp/core/common/validatePixKey";
import { PasteButton } from "@/app/components/buttons/pasteButton";
import { useRouter } from "next/router";
import { Button } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiClipboardFill,
  RiSaveLine,
} from "react-icons/ri";
import { useAccount } from "@/app/hooks/useAccount";
import { useCallback, useEffect, useState } from "react";
import { BottomNavigationItem } from "@/app/components/navigation/bottomNavigation";
import { useNotification } from "@/app/hooks/useNotification";

function mockRegisterInfo() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}

interface BankInfoFormData {
  pixKey: string;
}

interface Props {
  onNavChange: (bottomNav: BottomNavigationItem[]) => void;
}

export const BankingInformation = ({ onNavChange }: Props) => {
  const { t } = useTranslation();
  const { customer } = useAccount();
  const { query, replace } = useRouter();
  const { showSuccess, showError } = useNotification();
  const [isSaving, setIsSaving] = useState(false);

  // TODO: consider, when use has already
  const hasBankInformation = customer?.hasBankInformation;

  const {
    trigger,
    setValue,
    getValues,
    control,
    formState: { errors, isValid },
  } = useForm<BankInfoFormData>();

  const updateBankingInfo = useCallback(async () => {
    try {
      const { pixKey } = getValues();
      setIsSaving(true);
      await mockRegisterInfo();
      if (query.redirect) {
        await replace(query.redirect as string);
      }
      showSuccess(t("kyc-banking-info-saved"));
    } catch (e: any) {
      showError(t("kyc-banking-info-save-error"));
    } finally {
      setIsSaving(false);
    }
  }, [getValues, query.redirect, replace]);

  useEffect(() => {
    onNavChange([
      {
        label: t("back"),
        back: true,
        icon: <RiArrowLeftCircleLine />,
      },
      {
        label: t("save"),
        icon: <RiSaveLine />,
        disabled: !isValid,
        loading: isSaving,
        onClick: updateBankingInfo,
      },
    ]);
  }, [isSaving, isValid, onNavChange, t]);

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <section>
        <h3>{t("kyc-banking_info_title")}</h3>
        <p className="text-justify">{t("kyc-banking_info_description")}</p>
      </section>

      <section className="flex flex-col justify-center gap-2">
        <Controller
          name="pixKey"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("kyc-pix_key")}
              placeholder={t("kyc-pix_key_placeholder")}
              errorLabel={errors.pixKey?.message}
            />
          )}
          rules={{
            validate: (v) =>
              !validatePixKey(v) ? t("kyc-error_unsupported_pix_key") : true,
          }}
        />
        <div className="flex flex-row justify-around items-center mt-2">
          <PasteButton
            onText={(text) => {
              setValue("pixKey", text);
              trigger("pixKey");
            }}
          />
        </div>
      </section>
    </div>
  );
};
