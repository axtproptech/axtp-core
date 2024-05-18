import { CustomerSafeData } from "@/types/customerSafeData";
import { SignedDocumentSafeData } from "@/types/signedDocumentSafeData";

export const toSafeCustomerResponse = (customer: any): CustomerSafeData => {
  const {
    firstName,
    verificationLevel,
    cuid,
    signedDocuments: unsafeSignedDocuments,
    isActive,
    isBlocked,
    blockchainAccounts,
    bankInformation,
  } = customer;
  const publicKey =
    blockchainAccounts.length > 0 ? blockchainAccounts[0].publicKey : "";
  const hasBankInformation = bankInformation?.length > 0;

  const signedDocuments = unsafeSignedDocuments.map(
    ({ type, documentHash, transactionId, poolId, expiryAt }: any) => {
      const isExpired = expiryAt
        ? new Date(expiryAt).getTime() < Date.now()
        : false;
      return {
        type,
        isExpired,
        poolId,
        documentHash,
        transactionId,
      } as SignedDocumentSafeData;
    }
  );

  return {
    firstName,
    verificationLevel,
    customerId: cuid,
    isActive,
    isBlocked,
    publicKey,
    hasBankInformation,
    signedDocuments,
  };
};
