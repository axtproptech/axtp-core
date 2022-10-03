interface TermsOfUseResponse {
  customerId: number;
  termsOfUseId: number;
  createdAt: string;
  updatedAt: string;
  accepted: boolean;
}

interface BlockchainAccountResponse {
  id: number;
  createdAt: string;
  customerId: number;
  publicKey: string;
  accountId: string;
  rsAddress: string;
}

interface Address {
  id: number;
  createdAt: string;
  customerId: number;
  type: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  city: string;
  postCodeZip: string;
  state: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
}

interface Document {
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
}
