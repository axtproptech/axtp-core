import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cpf } from "cpf-cnpj-validator";
import { useAppSelector, useAppDispatch } from "@/states/hooks";
import { useNotification } from "@/app/hooks/useNotification";
import { useAppContext } from "@/app/hooks/useAppContext";
import { KycWizard } from "./validation/types";
import { KycWizardSchema } from "./validation/schemas";
import { WizardLayout } from "./components/WizardLayout";
import { AgreeTerms } from "./steps/AgreeTerms";
import { BasicData } from "./steps/BasicData";
import { ComplementaryData } from "./steps/ComplementaryData";
import { ResidencyData } from "./steps/ResidencyData";
import { MotherData } from "./steps/MotherData";
import { DocumentFiles } from "./steps/DocumentFiles";
import { BlockchainAccountSetup } from "./steps/BlockchainAccountSetup";
import { BlockchainAccountSeed } from "./steps/BlockchainAccountSeed";
import { BlockchainAccountSeedVerification } from "./steps/BlockchainAccountSeedVerification";
import { selectInitialSetupStep, kycActions } from "../../state";

export const Wizard = () => {
  const { t } = useTranslation();
  const { KycService } = useAppContext();
  const { showError } = useNotification();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentInitialSetupStep = useAppSelector(selectInitialSetupStep);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<KycWizard>({
    mode: "onChange",
    resolver: yupResolver(KycWizardSchema),
    defaultValues: {
      // Agree terms step
      agreeTerms: false,

      // Basic data step
      cpf: "",
      birthDate: "",
      birthPlace: "",

      // Complementary data step
      phone: "",
      profession: "",

      // Residency data step
      streetAddress: "",
      complementaryStreetAddress: "",
      zipCode: "",
      city: "",
      state: "",
      country: "BR",
      proofOfAddress: "",

      // Mother's data step
      firstNameMother: "",
      lastNameMother: "",

      // Document files step
      documentType: "cnh",
      frontSide: "",
      backSide: "",

      // Blockchain Account Step
      accountPublicKey: "",
      accountSeedPhrase: "",
      seedPhraseVerification: "",
      seedPhraseVerificationIndex: 0,
      agreeSafetyTerms: false,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<KycWizard> = async (data) => {
    try {
      setIsSubmitting(true);
      const { firstName, email, lastName } = currentInitialSetupStep;
      const {
        firstNameMother,
        lastNameMother,
        cpf: customerCpf,
        birthDate,
        birthPlace,
        phone,
        profession,
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
        agreeTerms,
        agreeSafetyTerms,
      } = data;

      const payload = {
        firstName,
        lastName,
        firstNameMother,
        lastNameMother,
        email,
        cpf: cpf.format(customerCpf),
        birthDate,
        birthPlace,
        phone,
        profession,
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
        agreeTerms,
        agreeSafetyTerms,
      };

      const response = await KycService.registerCustomer(payload);

      if (response!.customerId) {
        dispatch(kycActions.reset());
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
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <WizardLayout isSubmitting={isSubmitting}>
          <div className="carousel w-full mx-[2px]  overflow-x-hidden">
            <div id="step0" className="carousel-item relative w-full">
              <AgreeTerms firstName={currentInitialSetupStep.firstName} />
            </div>
            <div id="step1" className="carousel-item relative w-full">
              <BasicData />
            </div>
            <div id="step2" className="carousel-item relative w-full">
              <ComplementaryData />
            </div>
            <div id="step3" className="carousel-item relative w-full">
              <ResidencyData />
            </div>
            <div id="step4" className="carousel-item relative w-full">
              <MotherData />
            </div>
            <div id="step5" className="carousel-item relative w-full">
              <DocumentFiles />
            </div>
            <div id="step6" className="carousel-item relative w-full">
              <BlockchainAccountSetup />
            </div>
            <div id="step7" className="carousel-item relative w-full">
              <BlockchainAccountSeed />
            </div>
            <div id="step8" className="carousel-item relative w-full">
              <BlockchainAccountSeedVerification />
            </div>
          </div>
        </WizardLayout>
      </form>
    </FormProvider>
  );
};
