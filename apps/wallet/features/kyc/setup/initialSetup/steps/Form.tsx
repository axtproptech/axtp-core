import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { InitialSetupStep } from "@/app/types/kycData";

export const Form = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<InitialSetupStep>();

  let firstNameFieldError = "";
  if (errors.firstName?.message) {
    firstNameFieldError = t(mapValidationError(errors.firstName.message));
  }

  let lastNameFieldError = "";
  if (errors.lastName?.message) {
    lastNameFieldError = t(mapValidationError(errors.lastName.message));
  }

  let emailFieldError = "";
  if (errors.email?.message) {
    emailFieldError = t(mapValidationError(errors.email.message));
  }

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full max-w-xs mx-auto">
      <section>
        <h3>{t("initial_setup_title")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("first_name")}
              placeholder={t("enter_first_name_placeholder")}
              errorLabel={firstNameFieldError}
            />
          )}
        />

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("last_name")}
              placeholder={t("enter_last_name_placeholder")}
              errorLabel={lastNameFieldError}
            />
          )}
        />

        <p className="text-white text-center text-sm mb-0 whitespace-pre-wrap">
          {t("enter_legal_name_hint")}
        </p>

        <div className="divider m-0" />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              type="email"
              label={t("email_address")}
              placeholder={t("enter_email_address_placeholder")}
              helperText={t("enter_email_address_label")}
              errorLabel={emailFieldError}
            />
          )}
        />
      </section>

      <section />
    </div>
  );
};
