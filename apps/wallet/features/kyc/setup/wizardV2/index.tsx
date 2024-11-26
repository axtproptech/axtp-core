import { useAppSelector } from "@/states/hooks";
import { selectInitialSetupStep } from "../state";
import { Layout } from "@/app/components/layout";
import { FormWizard } from "@/app/components/formWizard";
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
  const { firstName, lastName, email } = useAppSelector(selectInitialSetupStep);

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
  );
};
