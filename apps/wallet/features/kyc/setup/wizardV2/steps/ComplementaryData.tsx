import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { KycFormData } from "./kycFormData";
import { Checkbox, Form } from "react-daisyui";
import { StepLayout } from "../../components/StepLayout";

export const ComplementaryData = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<KycFormData>();

  let phoneFieldError = "";
  if (errors.phone?.message) {
    phoneFieldError = t(mapValidationError(errors.phone.message));
  }

  let professionFieldError = "";
  if (errors.profession?.message) {
    professionFieldError = t(mapValidationError(errors.profession.message));
  }

  return (
    <StepLayout>
      <section>
        <h3>{t("sign_up_for_axt")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="pep"
          control={control}
          render={({ field }) => (
            <div className="shadow bg-base-200 w-xl rounded-lg p-4 w-full mb-4">
              <Form.Label
                title={t("politically_exposed_person")}
                className="text-left font-bold"
              >
                {/* @ts-ignore */}
                <Checkbox {...field} size="lg" className="ml-2" />
              </Form.Label>
            </div>
          )}
        />

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
    </StepLayout>
  );
};
