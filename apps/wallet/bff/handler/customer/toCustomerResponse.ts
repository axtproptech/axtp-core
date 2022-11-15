import { CustomerSafeData } from "@/types/customerSafeData";

export const toCustomerResponse = (customer: any): CustomerSafeData => {
  const { firstName, verificationLevel, cuid, termsOfUse } = customer;
  const acceptedTerms =
    termsOfUse.length === 0
      ? false
      : termsOfUse[termsOfUse.length - 1].accepted;
  return {
    firstName,
    verificationLevel,
    customerId: cuid,
    acceptedTerms,
  };
};
