import { BlockchainAccountResponse } from "@/bff/types/blockchainAccountResponse";

export interface CustomerTableResponse {
  count: number;
  customers: CustomerResponse[];
}

export interface CustomerResponse {
  cpfCnpj: string;
  createdAt: string;
  cuid: string;
  dateOfBirth: string;
  email1: string;
  email2: string | null;
  firstName: string;
  id: number;
  isActive: boolean;
  isBlocked: boolean;
  isInvited: boolean;
  isInBrazil: boolean;
  lastName: string;
  nationality: string;
  phone1: string;
  phone2: string | null;
  placeOfBirth: string;
  profession: string;
  updatedAt: string;
  verificationLevel: string;
  blockchainAccounts: BlockchainAccountResponse[];
}
