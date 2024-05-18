import { BlockchainAccountResponse } from "@/bff/types/blockchainAccountResponse";
import { Address } from "@/bff/types/address";

export interface SignedDocumentsResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  expiryAt: string;
  customerId: number;
  poolId: string;
  documentHash: string;
  url: string;
  type: string;
  transactionId: string;
}

export interface Document {
  id: number;
  createdAt: string;
  customerId: number;
  type: string;
  url: string;
}

export interface BankInformation {
  id: number;
  type: string;
  identifier: string;
}

export interface CustomerFullResponse {
  cpfCnpj: string;
  createdAt: string;
  cuid: string;
  dateOfBirth: string;
  email1: string;
  email2: string | null;
  firstName: string;
  firstNameMother: string;
  lastNameMother: string;
  id: number;
  isActive: boolean;
  isBlocked: boolean;
  lastName: string;
  nationality: string;
  phone1: string;
  phone2: string | null;
  placeOfBirth: string;
  profession: string;
  updatedAt: string;
  verificationLevel: string;
  signedDocuments: SignedDocumentsResponse[];
  blockchainAccounts: BlockchainAccountResponse[];
  bankInformation: BankInformation[];
  addresses: Address[];
  documents: Document[];
  isInvited: boolean;
  isInBrazil: boolean;
  isPep: boolean;
}
