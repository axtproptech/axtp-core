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
