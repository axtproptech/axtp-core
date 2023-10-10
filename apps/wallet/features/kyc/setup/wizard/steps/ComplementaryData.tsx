import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { KycWizard } from "../validation/types";

export const ComplementaryData = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<KycWizard>();

  let phoneFieldError = "";
  if (errors.phone?.message) {
    phoneFieldError = t(mapValidationError(errors.phone.message));
  }

  let professionFieldError = "";
  if (errors.profession?.message) {
    professionFieldError = t(mapValidationError(errors.profession.message));
  }

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto">
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("phone_number")}
              placeholder={t("phone_number_placeholder")}
              helperText="E.g. +5511912341234"
              errorLabel={phoneFieldError}
            />
          )}
        />

        <Controller
          name="profession"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("profession")}
              placeholder={t("profession_placeholder")}
              errorLabel={phoneFieldError}
            />
          )}
        />
      </section>

      <section />
    </div>
  );
};
