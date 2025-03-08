import * as yup from "yup";

import {
  requiredStringField,
  optionalStringField,
} from "@/app/validation/defaultSchemaMethods";

import "@/app/validation/defaultSchema";

export const initialSetupFormSchema = yup
  .object({
    firstName: requiredStringField,
    lastName: requiredStringField,
    email: requiredStringField.email(),
    code: optionalStringField,
  })
  .required();
