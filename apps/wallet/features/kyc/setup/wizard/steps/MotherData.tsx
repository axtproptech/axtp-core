import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { KycWizard } from "../validation/types";

export const MotherData = () => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors },
  } = useFormContext<KycWizard>();

  let firstNameFieldError = "";
  if (errors.firstNameMother?.message) {
    firstNameFieldError = t(mapValidationError(errors.firstNameMother.message));
  }

  let lastNameFieldError = "";
  if (errors.lastNameMother?.message) {
    lastNameFieldError = t(mapValidationError(errors.lastNameMother.message));
  }

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full max-w-xs mx-auto">
      <section>
        <h3>{t("mothers_full_name")}</h3>
        <p className="text-white text-justify font-medium text-sm">
          {t("mothers_full_name_description")}
        </p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="firstNameMother"
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
          name="lastNameMother"
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
          {t("enter_mothers_legal_name_hint")}
        </p>
      </section>
    </div>
  );
};
