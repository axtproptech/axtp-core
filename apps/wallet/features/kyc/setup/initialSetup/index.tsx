import { Layout } from "@/app/components/layout";
import { InitialSetupStep } from "@/app/types/kycData";
import {
  StepEmailValidation,
  StepInitialCustomerData,
  validate,
} from "./steps";
import { FormWizard } from "@/app/components/formWizard";

const InitialCustomerDataSteps = [StepInitialCustomerData, StepEmailValidation];

export const InitialCustomerDataWizard = () => (
  <Layout bottomNav={[]}>
    <FormWizard<InitialSetupStep>
      stepCount={InitialCustomerDataSteps.length}
      initialData={{
        firstName: "",
        lastName: "",
        email: "",
        code: "",
      }}
      validate={validate}
    >
      {(props) => {
        const Step = InitialCustomerDataSteps[props.step - 1];
        return <Step {...props} />;
      }}
    </FormWizard>
  </Layout>
);
