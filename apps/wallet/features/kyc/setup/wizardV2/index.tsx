import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cpf } from "cpf-cnpj-validator";
import { generateMasterKeys } from "@signumjs/crypto";
import { encrypt, stretchKey } from "@/app/sec";
import { useAppSelector, useAppDispatch } from "@/states/hooks";
import { useNotification } from "@/app/hooks/useNotification";
import { useAppContext } from "@/app/hooks/useAppContext";
import { accountActions } from "@/app/states/accountState";
import { WizardLayout } from "./components/WizardLayout";
import { BlockchainAccountSeed } from "./steps/BlockchainAccountSeed";
import { BlockchainAccountSeedVerification } from "./steps/BlockchainAccountSeedVerification";
import { selectInitialSetupStep, kycActions } from "../state";
import { Layout } from "@/app/components/layout";
import { FormWizard } from "@/app/components/formWizard";
import { InitialSetupStep } from "@/app/types/kycData";
import { validate } from "@/features/kyc/setup/initialSetup/steps";
import {
  BasicData,
  ComplementaryData,
  KycFormData,
  MotherData,
  ResidencyData,
  DocumentFiles,
  BlockchainAccountSetup,
} from "./steps";

const KycFormSteps = [
  BasicData,
  ComplementaryData,
  ResidencyData,
  MotherData,
  DocumentFiles,
  BlockchainAccountSetup,
];

const InitialKycFormData: KycFormData = {
  // pre-kyc data
  firstName: "",
  lastName: "",
  email: "",

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
  devicePin: "",
  accountPublicKey: "",
  accountSeedPhrase: "",
  seedPhraseVerification: "",
  seedPhraseVerificationIndex: 0,
  agreeSafetyTerms: false,
  pep: false,
};

export const WizardV2 = () => {
  const { t } = useTranslation();
  const { KycService } = useAppContext();
  const { showError } = useNotification();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { firstName, lastName, email } = useAppSelector(selectInitialSetupStep);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // const methods = useForm<KycFormData>({
  //   mode: "onChange",
  //   resolver: yupResolver(KycWizardSchema),
  //   defaultValues: {
  //     // Basic data step
  //     cpf: "",
  //     birthDate: "",
  //     birthPlace: "",
  //
  //     // Complementary data step
  //     phone: "",
  //     profession: "",
  //
  //     // Residency data step
  //     streetAddress: "",
  //     complementaryStreetAddress: "",
  //     zipCode: "",
  //     city: "",
  //     state: "",
  //     country: "BR",
  //     proofOfAddress: "",
  //
  //     // Mother's data step
  //     firstNameMother: "",
  //     lastNameMother: "",
  //
  //     // Document files step
  //     documentType: "cnh",
  //     frontSide: "",
  //     backSide: "",
  //
  //     // Blockchain Account Step
  //     devicePin: "",
  //     accountPublicKey: "",
  //     accountSeedPhrase: "",
  //     seedPhraseVerification: "",
  //     seedPhraseVerificationIndex: 0,
  //     agreeSafetyTerms: false,
  //   },
  // });

  // const { handleSubmit } = methods;
  //
  // const onSubmit: SubmitHandler<KycFormData> = async (data) => {
  //   try {
  //     setIsSubmitting(true);
  //     const { firstName, email, lastName } = currentInitialSetupStep;
  //     const {
  //       firstNameMother,
  //       lastNameMother,
  //       cpf: customerCpf,
  //       birthDate,
  //       birthPlace,
  //       phone,
  //       profession,
  //       pep,
  //       streetAddress,
  //       complementaryStreetAddress,
  //       state,
  //       city,
  //       zipCode,
  //       country,
  //       proofOfAddress,
  //       documentType,
  //       frontSide,
  //       backSide,
  //       accountPublicKey,
  //       agreeSafetyTerms,
  //       devicePin,
  //       accountSeedPhrase,
  //     } = data;
  //
  //     const payload = {
  //       firstName,
  //       lastName,
  //       firstNameMother,
  //       lastNameMother,
  //       email,
  //       cpf: cpf.format(customerCpf),
  //       birthDate,
  //       birthPlace,
  //       phone,
  //       profession,
  //       pep,
  //       streetAddress,
  //       complementaryStreetAddress,
  //       state,
  //       city,
  //       zipCode,
  //       country,
  //       proofOfAddress,
  //       documentType,
  //       frontSide,
  //       backSide,
  //       publicKey: accountPublicKey,
  //       agreeSafetyTerms,
  //     };
  //
  //     const response = await KycService.registerCustomer(payload);
  //
  //     if (response!.customerId) {
  //       dispatch(kycActions.reset());
  //
  //       const keys = generateMasterKeys(accountSeedPhrase);
  //       const { salt, key } = await stretchKey(devicePin);
  //       const securedKeys = await encrypt(key, JSON.stringify(keys));
  //
  //       dispatch(
  //         accountActions.setAccount({
  //           publicKey: keys.publicKey,
  //           securedKeys,
  //           salt,
  //         })
  //       );
  //
  //       await router.replace(`/kyc/setup/success?cuid=${response!.customerId}`);
  //     }
  //   } catch (e: any) {
  //     switch (e.message) {
  //       case "Customer already exists":
  //         showError(t("customer_already_exists"));
  //         break;
  //
  //       default:
  //         showError(e);
  //         break;
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <Layout bottomNav={[]}>
      <FormWizard<KycFormData>
        stepCount={KycFormSteps.length}
        initialData={{ ...InitialKycFormData, firstName, lastName, email }}
      >
        {(props) => {
          const Step = KycFormSteps[props.step - 1];
          return <Step {...props} />;
        }}
      </FormWizard>
    </Layout>

    // <FormProvider {...methods}>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <WizardLayout isSubmitting={isSubmitting}>
    //       <div className="carousel w-full mx-[2px]  overflow-x-hidden">
    //         <div id="step0" className="carousel-item relative w-full">
    //         </div>
    //         <div id="step1" className="carousel-item relative w-full">
    //           <BasicData />
    //         </div>
    //         <div id="step2" className="carousel-item relative w-full">
    //           <ComplementaryData />
    //         </div>
    //         <div id="step3" className="carousel-item relative w-full">
    //           <ResidencyData />
    //         </div>
    //         <div id="step4" className="carousel-item relative w-full">
    //           <MotherData />
    //         </div>
    //         <div id="step5" className="carousel-item relative w-full">
    //           <DocumentFiles />
    //         </div>
    //         <div id="step6" className="carousel-item relative w-full">
    //           <BlockchainAccountSetup />
    //         </div>
    //         <div id="step7" className="carousel-item relative w-full">
    //           <BlockchainAccountSeed />
    //         </div>
    //         <div id="step8" className="carousel-item relative w-full">
    //           <BlockchainAccountSeedVerification />
    //         </div>
    //       </div>
    //     </WizardLayout>
    //   </form>
    // </FormProvider>
  );
};
