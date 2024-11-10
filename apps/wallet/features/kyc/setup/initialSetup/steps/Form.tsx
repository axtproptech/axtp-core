import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { InitialSetupStep } from "@/app/types/kycData";
import { AttentionSeeker, Slide } from "react-awesome-reveal";
import * as React from "react";

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
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <Slide direction="down" triggerOnce>
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
      </Slide>

      <Slide direction="up" triggerOnce>
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

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FieldBox
                field={field}
                type="email"
                label={t("email_address")}
                placeholder={t("enter_email_address_placeholder")}
                errorLabel={emailFieldError}
              />
            )}
          />
        </section>
      </Slide>

      <section />
    </div>
  );
};
