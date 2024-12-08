import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import {
  RiArrowLeftCircleLine,
  RiClipboardLine,
  RiMailSendLine,
} from "react-icons/ri";
import { FieldBox } from "@/app/components/fieldBox";
import { useNotification } from "@/app/hooks/useNotification";
import { mapValidationError } from "@/app/mapValidationError";
import { AnimatedIconMailSend } from "@/app/components/animatedIcons/animatedIconMailSend";
import { StepLayout } from "../../components/StepLayout";
import { InitialCustomerDataStepProps } from "./initialCustomerDataStepProps";
import { useEffect, useState } from "react";
import { voidFn } from "@/app/voidFn";
import * as React from "react";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useRouter } from "next/router";
import { kycActions } from "@/features/kyc/setup/state";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useAppDispatch } from "@/states/hooks";

const { setInitialSetupStep, reset } = kycActions;

export const StepEmailValidation = ({
  validation,
  formData,
  updateFormData,
  previousStep,
}: InitialCustomerDataStepProps) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const { KycService } = useAppContext();
  const { setNavItems } = useBottomNavigation();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const dispatch = useAppDispatch();

  const canVerify = formData.code.length > 0 && !validation.hasError;

  useEffect(() => {
    setNavItems([
      {
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        onClick: previousStep,
        type: "button",
      },
      {
        onClick: voidFn,
        label: "",
        icon: <div />,
      },
      {
        onClick: verifyEmailCode,
        label: t("verify"),
        icon: <RiMailSendLine />,
        loading: isVerifying,
        disabled: !canVerify,
        color: "secondary",
      },
    ]);
  }, [canVerify, isVerifying]);

  const verifyEmailCode = async () => {
    try {
      setIsVerifying(true);
      await KycService.verifyEmailVerificationToken(
        formData.email,
        formData.code
      );
      dispatch(reset());
      // Now with a clean KYCState, start the KYC wizard
      dispatch(setInitialSetupStep(formData));
      await router.push("/kyc/setup/wizard");
    } catch (e: any) {
      showError(e.message === "invalid" ? t("invalid_token") : e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const pasteCode = async () => {
    if (!navigator) return;

    await navigator.clipboard
      .readText()
      .then((text) => {
        updateFormData("code", text);
        showSuccess(t("code_pasted_successfully"));
      })
      .catch((e) => {
        showError(t("clipboard_permission_denied"));
      });
  };

  let codeFieldError = "";
  if (validation.errors?.code) {
    codeFieldError = t(mapValidationError(validation.errors.code));
  }

  return (
    <StepLayout>
      <section>
        <h2>{t("verify_your_email")}</h2>
      </section>

      <section className="flex flex-col justify-center items-center gap-4">
        <div className="w-40 h-32">
          <AnimatedIconMailSend loopDelay={500} />
        </div>

        <span className="text-center text-base">
          {t("verify_your_email_hint", { email: formData.email })}
        </span>

        <FieldBox
          onChange={(e) => updateFormData("code", e.target.value)}
          placeholder={t("enter_email_code")}
          errorLabel={codeFieldError}
          className="text-center"
          value={formData.code}
        />

        <Button
          type="button"
          color="warning"
          startIcon={<RiClipboardLine />}
          onClick={pasteCode}
          className="font-bold"
        >
          {t("paste_code")}
        </Button>
      </section>

      <section />
    </StepLayout>
  );
};
