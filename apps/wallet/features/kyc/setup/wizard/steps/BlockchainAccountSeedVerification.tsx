import { useTranslation } from "next-i18next";
import { Form, Checkbox } from "react-daisyui";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { KycWizard } from "../validation/types";

export const BlockchainAccountSeedVerification = () => {
  const { t } = useTranslation();
  const { control, watch } = useFormContext<KycWizard>();

  const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");

  const defaultFieldText = t("enter_word_number", {
    number: seedPhraseVerificationIndex,
  });

  return (
    <div className="flex flex-col justify-start text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm mx-auto">
      <section>
        <h3>{t("verification")}</h3>
        <p className="text-white text-justify font-bold">
          {t("enter_seed_phrase_verification", {
            seedIndex: seedPhraseVerificationIndex,
          })}
        </p>
      </section>

      <section className="flex flex-col justify-start items-center gap-2">
        <Controller
          name="seedPhraseVerification"
          control={control}
          render={({ field }) => (
            <FieldBox
              field={field}
              label={defaultFieldText}
              placeholder={defaultFieldText}
              className="text-center font-bold text-white"
            />
          )}
        />

        <div className="divider" />

        <h6 className="text-justify font-bold">{t("safety_terms")}</h6>

        <span className="text-white text-justify font-bold mb-2">
          {t("confirm_saved_seed_phrase_paragraph")}
        </span>

        <Controller
          name="agreeSafetyTerms"
          control={control}
          render={({ field }) => (
            <div className="shadow bg-base-200 w-64 rounded-lg p-4">
              <Form.Label title={t("accept")}>
                {/* @ts-ignore */}
                <Checkbox {...field} size="lg" />
              </Form.Label>
            </div>
          )}
        />
      </section>

      <section />
    </div>
  );
};
