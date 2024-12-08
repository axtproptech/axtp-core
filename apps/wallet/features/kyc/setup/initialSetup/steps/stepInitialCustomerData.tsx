import { useTranslation } from "next-i18next";
import { FieldBox } from "@/app/components/fieldBox";
import { AttentionSeeker } from "react-awesome-reveal";
import * as React from "react";
import { InitialCustomerDataStepProps } from "./initialCustomerDataStepProps";
import { StepLayout } from "@/features/kyc/setup/components/StepLayout";
import { ChangeEvent, useEffect, useState } from "react";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine } from "react-icons/ri";
import { voidFn } from "@/app/voidFn";
import { useRouter } from "next/router";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";

export const StepInitialCustomerData = ({
  formData,
  updateFormData,
  nextStep,
  validation: { hasError, errors },
}: InitialCustomerDataStepProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setNavItems } = useBottomNavigation();
  const { KycService } = useAppContext();
  const { showInfo, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = !isSubmitting || (formData.email.length > 0 && !hasError);

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        onClick: router.back,
        type: "button",
      },
      {
        onClick: voidFn,
        label: "",
        icon: <div />,
      },
      {
        onClick: () => handleSendVerificationCode(),
        label: t("next"),
        icon: <RiArrowRightCircleLine />,
        disabled: !canProceed,
        color: "secondary",
      },
    ]);
  }, [canProceed, router]);

  const handleSendVerificationCode = async () => {
    const { email, firstName } = formData;
    setIsSubmitting(true);
    try {
      const response = await KycService.fetchCustomerDataByEmail(email);
      if (response) {
        await router.replace("/account/import");
        return showInfo(t("account_already_created"));
      }
    } catch (error) {
      // if no response, then user does not exist
    }
    try {
      await KycService.sendAddressVerificationMail(email, firstName);
      nextStep();
    } catch (e: any) {
      switch (e.message) {
        case "Blocked":
          showError(t("email_blocked", { email }));
          break;
        case "Too many requests":
          showError(t("wait_time_for_token_req"));
          break;
        default:
          showError(e);
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange =
    (fieldName: keyof typeof formData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      updateFormData(fieldName, e.target.value);
    };

  return (
    <StepLayout>
      <section>
        <AttentionSeeker effect="heartBeat" delay={1000} triggerOnce>
          <img
            src="/assets/img/axt-logo-only.svg"
            className="w-[64px] mx-auto"
            alt="AXT Logo"
          />
        </AttentionSeeker>
        <h3>{t("initial_setup_title")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <FieldBox
          label={t("first_name")}
          placeholder={t("enter_first_name_placeholder")}
          errorLabel={t(errors?.firstName ?? "")}
          onChange={handleChange("firstName")}
          value={formData.firstName}
        />
        <FieldBox
          label={t("last_name")}
          placeholder={t("enter_last_name_placeholder")}
          errorLabel={t(errors?.lastName ?? "")}
          onChange={handleChange("lastName")}
          value={formData.lastName}
        />
        <FieldBox
          label={t("email_address")}
          placeholder={t("enter_email_address_placeholder")}
          errorLabel={t(errors?.email ?? "")}
          onChange={handleChange("email")}
          value={formData.email}
        />
      </section>
      <section />
    </StepLayout>
  );
};
