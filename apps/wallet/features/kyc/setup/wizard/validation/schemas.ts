import * as yup from "yup";

import {
  booleanField,
  requiredStringField,
  optionalStringField,
  requiredNumberFieldDefaultZero,
} from "@/app/validation/defaultSchemaMethods";

import "@/app/validation/defaultSchema";

export const KycWizardSchema = yup
  .object({
    // Agree terms step
    agreeTerms: booleanField,

    // Basic data step
    cpf: requiredStringField.min(11),
    birthDate: requiredStringField,
    birthPlace: requiredStringField,

    // Complementary data step
    phone: requiredStringField,
    profession: requiredStringField,

    // Residency data step
    streetAddress: requiredStringField,
    complementaryStreetAddress: requiredStringField,
    zipCode: requiredStringField,
    city: requiredStringField,
    state: requiredStringField,
    country: requiredStringField,
    proofOfAddress: requiredStringField,

    // Mother's data step
    firstName: requiredStringField,
    lastName: requiredStringField,

    // Document files step
    documentType: requiredStringField,
    frontSide: requiredStringField,
    backSide: optionalStringField,

    // Blockchain Account Step
    accountId: requiredStringField,
    accountSeedPhrase: requiredStringField,
    seedPhraseVerification: requiredStringField,
    seedPhraseVerificationIndex: requiredNumberFieldDefaultZero,
    agreeSafetyTerms: booleanField,
  })
  .required();
