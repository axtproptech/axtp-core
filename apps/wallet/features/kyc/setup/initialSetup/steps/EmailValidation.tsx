import { useTranslation } from "next-i18next";
import { Button } from "react-daisyui";
import { useFormContext, Controller } from "react-hook-form";
import { RiClipboardLine } from "react-icons/ri";
import { FieldBox } from "@/app/components/fieldBox";
import { useNotification } from "@/app/hooks/useNotification";
import { mapValidationError } from "@/app/mapValidationError";
import { InitialSetupStep } from "@/app/types/kycData";
import { AnimatedIconMailSend } from "@/app/components/animatedIcons/animatedIconMailSend";
import { StepLayout } from "../../components/StepLayout";

export const EmailValidation = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const {
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InitialSetupStep>();

  const email = watch("email");

  const pasteCode = async () => {
    if (!navigator) return;

    await navigator.clipboard
      .readText()
      .then((text) => {
        setValue("code", text);
        showSuccess(t("code_pasted_successfully"));
      })
      .catch((e) => {
        showError(t("clipboard_permission_denied"));
      });
  };

  let codeFieldError = "";
  if (errors.code?.message) {
    codeFieldError = t(mapValidationError(errors.code.message));
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
          {t("verify_your_email_hint", { email })}
        </span>

        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              placeholder={t("enter_email_code")}
              errorLabel={codeFieldError}
              className="text-center"
            />
          )}
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
