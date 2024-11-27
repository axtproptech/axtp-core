import * as yup from "yup";

import {
  booleanField,
  requiredStringField,
  optionalStringField,
  requiredNumberFieldDefaultZero,
} from "@/app/validation/defaultSchemaMethods";

import "@/app/validation/defaultSchema";
import { InitialSetupStep } from "@/app/types/kycData";
import { FormWizardValidation } from "@/app/components/formWizard";
import { ValidationError } from "yup";
import { mapValidationError } from "@/app/mapValidationError";
import { KycFormData } from "@/features/kyc/setup/wizard/steps/kycFormData";

export const kycFormDataSchema = yup
  .object({
    // Basic data step
    cpf: requiredStringField,
    birthDate: requiredStringField,
    birthPlace: requiredStringField,

    // Complementary data step
    phone: requiredStringField,
    profession: requiredStringField,
    pep: booleanField,

    // Residency data step
    streetAddress: requiredStringField,
    complementaryStreetAddress: optionalStringField,
    zipCode: requiredStringField,
    city: requiredStringField,
    state: requiredStringField,
    country: optionalStringField,
    proofOfAddress: requiredStringField,

    // Mother's data step
    firstNameMother: requiredStringField,
    lastNameMother: requiredStringField,

    // Document files step
    documentType: requiredStringField,
    frontSide: requiredStringField,
    backSide: optionalStringField,

    // Blockchain Account Step
    devicePin: requiredStringField,
    accountPublicKey: requiredStringField,
    accountSeedPhrase: requiredStringField,
    seedPhraseVerification: requiredStringField,
    seedPhraseVerificationIndex: requiredNumberFieldDefaultZero,
    agreeSafetyTerms: booleanField,
  })
  .required();

export function validate(
  data: KycFormData,
  v: FormWizardValidation<KycFormData>
) {
  try {
    kycFormDataSchema.validateSync(data, { abortEarly: false });
  } catch (e: any) {
    const ve = e as ValidationError;
    ve.inner.forEach(({ path, message }) =>
      v.setError(path as keyof KycFormData, mapValidationError(message))
    );
  }
}
