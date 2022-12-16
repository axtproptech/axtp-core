import { CustomerSafeData } from "@/types/customerSafeData";

export const toSafeCustomerResponse = (customer: any): CustomerSafeData => {
  const {
    firstName,
    verificationLevel,
    cuid,
    termsOfUse,
    isActive,
    isBlocked,
  } = customer;
  const acceptedTerms =
    termsOfUse.length === 0
      ? false
      : termsOfUse[termsOfUse.length - 1].accepted;
  return {
    firstName,
    verificationLevel,
    customerId: cuid,
    acceptedTerms,
    isActive,
    isBlocked,
  };
};
