import { useTranslation } from "next-i18next";
import { FieldBox } from "@/app/components/fieldBox";
import { validatePixKey } from "@axtp/core";
import { PasteButton } from "@/app/components/buttons/pasteButton";
import { useRouter } from "next/router";
import { RiArrowLeftCircleLine, RiSaveLine } from "react-icons/ri";
import { useAccount } from "@/app/hooks/useAccount";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNotification } from "@/app/hooks/useNotification";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useSWRConfig } from "swr";
import { voidFn } from "@/app/voidFn";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";

export const BankingInformation = () => {
  const { t } = useTranslation();
  const { customer } = useAccount();
  const { query, replace } = useRouter();
  const { showSuccess, showError } = useNotification();
  const { KycService } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const { setNavItems } = useBottomNavigation();
  const { mutate } = useSWRConfig();
  const [pixKey, setPixKey] = useState("");
  const [error, setError] = useState("");

  const updateBankingInfo = useCallback(async () => {
    if (!customer) return;
    try {
      setIsSaving(true);
      await KycService.addBankingInfo(customer.customerId, pixKey, "Pix");
      await mutate(`/fetchCustomer/${customer.customerId}`);
      if (query.redirect) {
        await replace(query.redirect as string);
      }
      showSuccess(t("kyc-banking-info-saved"));
    } catch (e: any) {
      showError(t("kyc-banking-info-save-error"));
    } finally {
      setIsSaving(false);
    }
  }, [query.redirect, replace, pixKey]);

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        back: true,
        icon: <RiArrowLeftCircleLine />,
      },
      {
        label: "",
        disabled: true,
        hideLabel: true,
        onClick: voidFn,
        icon: <></>,
      },
      {
        label: t("save"),
        icon: <RiSaveLine />,
        color: "secondary",
        disabled: Boolean(error),
        loading: isSaving,
        onClick: updateBankingInfo,
      },
    ]);
  }, [isSaving, error, updateBankingInfo]);

  useEffect(() => {
    setError("");
    if (!validatePixKey(pixKey)) {
      setError(t("kyc-error_unsupported_pix_key"));
    }
  }, [pixKey]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;
  };

  if (customer && customer.hasBankInformation) {
    replace("/");
    return null;
  }

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <section>
        <h3>{t("kyc-banking_info_title")}</h3>
        <p className="text-justify">{t("kyc-banking_info_description")}</p>
      </section>

      <section className="flex flex-col justify-center gap-2">
        <FieldBox
          onChange={handleOnChange}
          label={t("kyc-pix_key")}
          placeholder={t("kyc-pix_key_placeholder")}
          errorLabel={error}
        />
        <div className="flex flex-row justify-around items-center mt-2">
          <PasteButton onText={setPixKey} />
        </div>
      </section>
    </div>
  );
};
