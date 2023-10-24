import { useTranslation } from "next-i18next";
import { Input } from "react-daisyui";
import { cpf } from "cpf-cnpj-validator";
import { useFormContext, Controller } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { KycWizard } from "../validation/types";

import differenceInYears from "date-fns/differenceInYears";

export const BasicData = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<KycWizard>();

  const customerCpf = watch("cpf");
  const birthDate = watch("birthDate");

  let cpfFieldError = "";
  if (errors.cpf?.message) {
    cpfFieldError = t(
      mapValidationError(errors.cpf.message),
      mapValidationError(errors.cpf.message, true)
    );
  }

  // Custom CPF Validation
  if (!cpfFieldError && customerCpf && !cpf.isValid(`${customerCpf}`)) {
    cpfFieldError = t("invalid_cpf");
  }

  let birthDateFieldError = "";
  if (errors.birthDate?.message) {
    birthDateFieldError = t(mapValidationError(errors.birthDate.message));
  }

  // Custom Birth Date Validation
  if (!birthDateFieldError && birthDate) {
    const currentDate = new Date();
    const formattedBirthDate = new Date(birthDate);

    if (differenceInYears(currentDate, formattedBirthDate) < 18) {
      birthDateFieldError = t("you_must_be_an_adult");
    }
  }

  let birthPlaceFieldError = "";
  if (errors.birthPlace?.message) {
    birthPlaceFieldError = t(mapValidationError(errors.birthPlace.message));
  }

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto px-4">
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-base">{t("cpf")}</span>
          </label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <PatternFormat
                {...field}
                format="###.###.###-##"
                customInput={Input}
                // @ts-ignore
                ref={undefined}
                inputRef={field.ref}
                allowEmptyFormatting
                onChange={undefined}
                onValueChange={(values) => {
                  field.onChange(values.floatValue);
                }}
                mask="_"
                size="lg"
                className="font-semibold"
              />
            )}
          />

          <label className="label">
            {cpfFieldError ? (
              <span className="label-text-alt font-bold text-red-700">
                {cpfFieldError}
              </span>
            ) : (
              <span className="label-text-alt font-bold text-white">
                {t("enter_cpf_field_hint")}
              </span>
            )}
          </label>
        </div>

        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              type="date"
              label={t("birth_date")}
              errorLabel={birthDateFieldError}
            />
          )}
        />

        <Controller
          name="birthPlace"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("birth_place")}
              placeholder={t("birth_place_placeholder")}
              errorLabel={birthPlaceFieldError}
            />
          )}
        />
      </section>

      <section />
    </div>
  );
};
