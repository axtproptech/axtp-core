import * as yup from "yup";

import {
  requiredStringField,
  optionalStringField,
} from "@/app/validation/defaultSchemaMethods";

import "@/app/validation/defaultSchema";
import { InitialSetupStep } from "@/app/types/kycData";
import { FormWizardValidation } from "@/app/components/formWizard";
import { ValidationError } from "yup";
import { mapValidationError } from "@/app/mapValidationError";

const initialSetupFormSchema = yup
  .object({
    firstName: requiredStringField,
    lastName: requiredStringField,
    email: requiredStringField.email(),
    code: optionalStringField,
  })
  .required();

export function validate(
  data: InitialSetupStep,
  v: FormWizardValidation<InitialSetupStep>
) {
  try {
    initialSetupFormSchema.validateSync(data, { abortEarly: false });
  } catch (e: any) {
    const ve = e as ValidationError;
    ve.inner.forEach(({ path, message }) =>
      v.setError(path as keyof InitialSetupStep, mapValidationError(message))
    );
  }
}
