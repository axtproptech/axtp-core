import { useTranslation } from "next-i18next";
import { Form, Checkbox } from "react-daisyui";
import { useFormContext, Controller } from "react-hook-form";
import { FieldBox } from "@/app/components/fieldBox";
import { KycFormData } from "./kycFormData";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { StepLayout } from "../../components/StepLayout";

export const BlockchainAccountSeedVerification = () => {
  const { t } = useTranslation();
  const { control, watch, getValues } = useFormContext<KycFormData>();

  const seedPhraseVerificationIndex = watch("seedPhraseVerificationIndex");
  const enteredWord = watch("seedPhraseVerification");

  const defaultFieldText = t("enter_word_number", {
    number: seedPhraseVerificationIndex,
  });

  const isCorrectWord =
    enteredWord ===
    getValues("accountSeedPhrase")
      .split(" ")
      .at(seedPhraseVerificationIndex - 1);

  return (
    <StepLayout>
      <section>
        <h3>{t("verification")}</h3>
        <p className="text-justify font-bold">
          {t("enter_seed_phrase_verification", {
            seedIndex: seedPhraseVerificationIndex,
          })}
        </p>
      </section>

      <section>
        <Controller
          name="seedPhraseVerification"
          control={control}
          render={({ field }) => (
            <div className="relative">
              <FieldBox
                field={field}
                label={defaultFieldText}
                placeholder={defaultFieldText}
                className="text-center font-bold text-white"
              />
              {isCorrectWord && (
                <RiCheckboxCircleLine className="absolute top-[48px] right-2" />
              )}
            </div>
          )}
        />
      </section>

      <section className="flex flex-col justify-start items-center gap-2 mt-10">
        <h3 className="m-0">{t("safety_terms")}</h3>
        <div className="text-justify mb-2">
          {t("confirm_saved_seed_phrase_paragraph")}
        </div>
        <Controller
          name="agreeSafetyTerms"
          control={control}
          render={({ field }) => (
            <div className="shadow bg-base-200 rounded-lg p-4">
              <Form.Label className="text-left" title={t("accept_terms")}>
                {/* @ts-ignore */}
                <Checkbox {...field} size="lg" />
              </Form.Label>
            </div>
          )}
        />
      </section>
    </StepLayout>
  );
};
