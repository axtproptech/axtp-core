import { useTranslation } from "next-i18next";
import { useFormContext, Controller } from "react-hook-form";
import { Alert } from "react-daisyui";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FieldBox } from "@/app/components/fieldBox";
import { mapValidationError } from "@/app/mapValidationError";
import { FileUploader } from "@/app/components/fileUploader";
import { KycWizard } from "../validation/types";

export const ResidencyData = () => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<KycWizard>();

  const proofOfAddress = watch("proofOfAddress");

  const setProofOfAddressValue = (value: string) => {
    setValue("proofOfAddress", value);
  };

  let streetAddressFieldError = "";
  if (errors.streetAddress?.message) {
    streetAddressFieldError = t(
      mapValidationError(errors.streetAddress.message)
    );
  }

  let complementaryStreetAddressFieldError = "";
  if (errors.complementaryStreetAddress?.message) {
    complementaryStreetAddressFieldError = t(
      mapValidationError(errors.complementaryStreetAddress.message)
    );
  }

  let zipCodeFieldError = "";
  if (errors.zipCode?.message) {
    zipCodeFieldError = t(mapValidationError(errors.zipCode.message));
  }

  let cityFieldError = "";
  if (errors.city?.message) {
    cityFieldError = t(mapValidationError(errors.city.message));
  }

  let stateFieldError = "";
  if (errors.state?.message) {
    stateFieldError = t(mapValidationError(errors.state.message));
  }

  let countryFieldError = "";
  if (errors.country?.message) {
    countryFieldError = t(mapValidationError(errors.country.message));
  }

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full max-w-xs mx-auto">
      <section>
        <h3 className="text-white">{t("residency_address")}</h3>
      </section>

      <section className="flex flex-col justify-center items-center gap-2">
        <Controller
          name="streetAddress"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("street_address")}
              placeholder={t("street_address_placeholder")}
              errorLabel={streetAddressFieldError}
            />
          )}
        />

        <Controller
          name="complementaryStreetAddress"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("second_street_address")}
              placeholder={t("second_street_address_placeholder")}
              errorLabel={complementaryStreetAddressFieldError}
            />
          )}
        />

        <div className="flex justify-between items-start w-full">
          <div className="w-1/2 pr-2">
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <FieldBox
                  field={field}
                  label={t("zip_code")}
                  placeholder={t("zip_code")}
                  errorLabel={zipCodeFieldError}
                />
              )}
            />
          </div>

          <div className="w-1/2">
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FieldBox
                  field={field}
                  label={t("city")}
                  placeholder={t("city")}
                  errorLabel={cityFieldError}
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={t("state")}
              placeholder={t("state")}
              errorLabel={stateFieldError}
            />
          )}
        />

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={`${t("country")}/${t("region")}`}
              placeholder={`${t("country")}/${t("region")}`}
              errorLabel={countryFieldError}
              className="mb-4"
            />
          )}
        />

        <section>
          <h3 className="my-0 mb-4">{t("proof_of_address")}</h3>
          <div className="card glass w-full bg-base-100 shadow-xl">
            <div className="card-body flex-col justify-center items-center">
              {!!proofOfAddress && (
                <Alert
                  status="success"
                  className="text-sm text-center font-bold"
                >
                  <RiCheckboxCircleLine size={24} /> {t("file_upload_success")}
                </Alert>
              )}

              <FileUploader
                onUploadSuccess={setProofOfAddressValue}
                fileTypes={["image/*", "application/pdf"]}
              />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};
