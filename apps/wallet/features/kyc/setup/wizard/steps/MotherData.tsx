import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { KycWizard } from "../validation/types";
import { StepLayout } from "../../components/StepLayout";

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
    <StepLayout>
      <section>
        <h3>{t("mothers_full_name")}</h3>
        <p className="text-justify">{t("mothers_full_name_description")}</p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="firstNameMother"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("mothers_first_name")}
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
              label={t("mothers_last_name")}
              placeholder={t("enter_last_name_placeholder")}
              errorLabel={lastNameFieldError}
            />
          )}
        />
      </section>
    </StepLayout>
  );
};
