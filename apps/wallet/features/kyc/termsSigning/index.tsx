import { useRouter } from "next/router";
import { StepIntro } from "./steps/stepIntro";
import { StepDocument } from "./steps/stepDocument";
import { StepSign } from "./steps/stepSign";
import { FormWizard } from "@/app/components/formWizard/formWizard";
import { SigningFormData } from "@/features/kyc/termsSigning/signingFormData";
import {
  SigningQuerySchema,
  SigningQuerySchemaType,
} from "@/features/kyc/termsSigning/signingQuerySchema";

const SigningSteps = [StepIntro, StepDocument, StepSign];

export const TermsSigning = () => {
  const router = useRouter();

  let params: SigningQuerySchemaType | null = null;
  try {
    params = SigningQuerySchema.validateSync(router.query);
  } catch (e: any) {
    console.error("Invalid query params", e.message);
  }
  if (!params) {
    router.replace("/");
    return null;
  }

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <div className="mt-4">
        <TermsSigningForm {...params} />
      </div>
    </div>
  );
};

const TermsSigningForm = (queryParams: SigningQuerySchemaType) => {
  const initialState = {
    signed: false,
    document: null,
    queryParams,
  };

  return (
    <div className="flex flex-col justify-between text-center h-[80vh] relative prose w-full xs:max-w-xs sm:max-w-sm md:max-w-lg mx-auto px-4">
      <div className="mt-4">
        <FormWizard<SigningFormData, any>
          stepCount={SigningSteps.length}
          initialState={initialState}
        >
          {(props) => {
            const Step = SigningSteps[props.step - 1];
            if (!Step) return null;
            return <Step {...props} />;
          }}
        </FormWizard>
      </div>
    </div>
  );
};
