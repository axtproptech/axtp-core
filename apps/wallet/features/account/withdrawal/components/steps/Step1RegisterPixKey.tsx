import { useTranslation } from "next-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { WithdrawalFormData } from "../../types/withdrawalFormData";
import { mapValidationError } from "@/app/mapValidationError";

export const Step1RegisterPixKey = () => {
  const { t } = useTranslation("withdrawal");
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<WithdrawalFormData>();

  let pixKeyFieldError = "";
  if (errors.pixKey?.message) {
    pixKeyFieldError = t(mapValidationError(errors.pixKey.message));
  }

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <section>
        <h3>{t("banking_info_title")}</h3>
        <p className="text-justify">{t("banking_info_description")}</p>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="pixKey"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("pix_key")}
              placeholder={t("pix_key_placeholder")}
              errorLabel={pixKeyFieldError}
            />
          )}
        />
      </section>
    </div>
  );
};
