import { useTranslation } from "next-i18next";
import { Form, Checkbox } from "react-daisyui";
import { FieldBox } from "@/app/components/fieldBox";
import {
  RiArrowLeftCircleLine,
  RiCheckboxCircleLine,
  RiProfileFill,
} from "react-icons/ri";
import { StepLayout } from "../../components/StepLayout";
import { KycFormDataStepProps } from "./kycFormDataStepProps";
import { useBottomNavigation } from "@/app/components/navigation/bottomNavigation";
import { useCallback, useEffect, useState } from "react";
import { voidFn } from "@/app/voidFn";
import * as React from "react";
import { cpf as CpfFormatter } from "cpf-cnpj-validator";
import { generateMasterKeys } from "@signumjs/crypto";
import { encrypt, stretchKey } from "@/app/sec";
import { useAppContext } from "@/app/hooks/useAppContext";
import { accountActions } from "@/app/states/accountState";
import { useAppDispatch } from "@/states/hooks";
import { useNotification } from "@/app/hooks/useNotification";
import { useRouter } from "next/router";

export const BlockchainAccountSeedVerification = ({
  previousStep,
  updateFormData,
  formData,
  validation,
}: KycFormDataStepProps) => {
  const { t } = useTranslation();
  const { setNavItems } = useBottomNavigation();
  const { showError } = useNotification();
  const { KycService } = useAppContext();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    accountSeedPhrase,
    seedPhraseVerificationIndex,
    seedPhraseVerification,
  } = formData;

  const isCorrectWord = accountSeedPhrase
    .split(" ")
    .at(seedPhraseVerificationIndex - 1);

  const canSubmit =
    isCorrectWord && formData.agreeSafetyTerms && !validation.hasError;

  const submitFormData = useCallback(async () => {
    if (!canSubmit) {
      console.error("Cannot submit data...something is wrong");
      return;
    }

    try {
      setIsSubmitting(true);
      const { firstName, email, lastName } = formData;
      const {
        firstNameMother,
        lastNameMother,
        cpf: customerCpf,
        birthDate,
        birthPlace,
        phone,
        profession,
        pep,
        streetAddress,
        complementaryStreetAddress,
        state,
        city,
        zipCode,
        country,
        proofOfAddress,
        documentType,
        frontSide,
        backSide,
        accountPublicKey,
        agreeSafetyTerms,
        devicePin,
        accountSeedPhrase,
      } = formData;

      const payload = {
        firstName,
        lastName,
        firstNameMother,
        lastNameMother,
        email,
        cpf: CpfFormatter.format(customerCpf),
        birthDate,
        birthPlace,
        phone,
        profession,
        pep,
        streetAddress,
        complementaryStreetAddress,
        state,
        city,
        zipCode,
        country,
        proofOfAddress,
        documentType,
        frontSide,
        backSide,
        publicKey: accountPublicKey,
        agreeSafetyTerms,
      };

      const response = await KycService.registerCustomer(payload);

      if (response!.customerId) {
        // dispatch(kycActions.reset());

        const keys = generateMasterKeys(accountSeedPhrase);
        const { salt, key } = await stretchKey(devicePin);
        const securedKeys = await encrypt(key, JSON.stringify(keys));

        dispatch(
          accountActions.setAccount({
            publicKey: keys.publicKey,
            securedKeys,
            salt,
          })
        );

        await router.replace(`/kyc/setup/success?cuid=${response!.customerId}`);
      }
    } catch (e: any) {
      switch (e.message) {
        case "Customer already exists":
          showError(t("customer_already_exists"));
          break;
        default:
          showError(e);
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [router, showError, canSubmit, formData, KycService, dispatch, t]);

  useEffect(() => {
    setNavItems([
      {
        onClick: previousStep,
        label: t("back"),
        icon: <RiArrowLeftCircleLine />,
        type: "button",
      },
      {
        onClick: voidFn,
        label: "",
        icon: <div />,
      },
      {
        onClick: submitFormData,
        label: t("submit"),
        icon: <RiProfileFill />,
        disabled: !canSubmit,
        loading: isSubmitting,
        color: "accent",
      },
    ]);
  }, [submitFormData, canSubmit, isSubmitting]);

  const defaultFieldText = t("enter_word_number", {
    number: seedPhraseVerificationIndex,
  });

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
        <div className="relative">
          <FieldBox
            onChange={(e) =>
              updateFormData("seedPhraseVerification", e.target.value)
            }
            value={seedPhraseVerification}
            label={defaultFieldText}
            placeholder={defaultFieldText}
            className="text-center font-bold text-white"
          />
          {isCorrectWord && (
            <RiCheckboxCircleLine className="absolute top-[48px] right-2" />
          )}
        </div>
      </section>

      <section className="flex flex-col justify-start items-center gap-2 mt-10">
        <h3 className="m-0">{t("safety_terms")}</h3>
        <div className="text-justify mb-2">
          {t("confirm_saved_seed_phrase_paragraph")}
        </div>
        <div className="shadow bg-base-200 rounded-lg p-4">
          <Form.Label className="text-left" title={t("accept_terms")}>
            <Checkbox
              checked={formData.agreeSafetyTerms}
              onChange={(e) =>
                updateFormData("agreeSafetyTerms", e.target.checked)
              }
              size="lg"
            />
          </Form.Label>
        </div>
      </section>
    </StepLayout>
  );
};
