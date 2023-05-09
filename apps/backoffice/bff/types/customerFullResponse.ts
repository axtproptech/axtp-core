import { Address } from "@/bff/types/address";
import { BlockchainAccountResponse } from "@/bff/types/blockchainAccountResponse";

export interface TermsOfUseResponse {
  customerId: number;
  termsOfUseId: number;
  createdAt: string;
  updatedAt: string;
  accepted: boolean;
}

export interface Document {
  id: number;
  createdAt: string;
  customerId: number;
  type: string;
  url: string;
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
  termsOfUse: TermsOfUseResponse[];
  blockchainAccounts: BlockchainAccountResponse[];
  addresses: Address[];
  documents: Document[];
  isInvited: boolean;
  isInBrazil: boolean;
}
