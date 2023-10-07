import * as yup from "yup";

export const transformNumber = (_: any, val: any) => (val ? Number(val) : null);

export const booleanField = yup.boolean();

export const requiredNumberFieldDefaultZero = yup
  .number()
  .required("required")
  .min(0)
  .default(0)
  .nullable()
  .transform(transformNumber);

export const requiredNumberField = yup
  .number()
  .required("required")
  .positive("positive")
  .nullable()
  .transform(transformNumber);

export const optionalNumberField = yup
  .number()
  .positive("positive")
  .nullable()
  .transform(transformNumber);

export const requiredStringField = yup.string().required("required").trim();

export const optionalStringField = yup.string().nullable().trim();

export const requiredUrlField = yup.string().url().required("required").trim();

export const optionalUrlField = yup.string().url().nullable().trim();
