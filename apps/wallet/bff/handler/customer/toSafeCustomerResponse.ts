import { CustomerSafeData } from "@/types/customerSafeData";

export const toSafeCustomerResponse = (customer: any): CustomerSafeData => {
  const {
    firstName,
    verificationLevel,
    cuid,
    termsOfUse,
    isActive,
    isBlocked,
    blockchainAccounts,
  } = customer;
  const acceptedTerms =
    termsOfUse.length === 0
      ? false
      : termsOfUse[termsOfUse.length - 1].accepted;

  const publicKey =
    blockchainAccounts.length > 0 ? blockchainAccounts[0].publicKey : "";
  return {
    firstName,
    verificationLevel,
    customerId: cuid,
    acceptedTerms,
    isActive,
    isBlocked,
    publicKey,
  };
};
