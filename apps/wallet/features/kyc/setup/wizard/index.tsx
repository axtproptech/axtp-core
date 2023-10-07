import { useTranslation } from "next-i18next";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNotification } from "@/app/hooks/useNotification";
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

export const Wizard = () => {
  const { t } = useTranslation();
  const { showError } = useNotification();

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
      country: "",
      proofOfAddress: "",

      // Mother's data step
      firstName: "",
      lastName: "",

      // Document files step
      documentType: "cnh",
      frontSide: "",
      backSide: "",

      // Blockchain Account Step
      accountId: "",
      accountSeedPhrase: "",
      seedPhraseVerification: "",
      seedPhraseVerificationIndex: 0,
      agreeSafetyTerms: false,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<KycWizard> = async (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <WizardLayout>
          <div className="carousel w-full mx-[2px]  overflow-x-hidden">
            <div id="step0" className="carousel-item relative w-full">
              <AgreeTerms />
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
