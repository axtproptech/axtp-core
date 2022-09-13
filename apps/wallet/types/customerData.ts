export interface CustomerData {
  id: number;
  createdAt: string; // ISO DATE
  updatedAt: string; // ISO DATE
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO DATE
  placeOfBirth: string;
  nationality: string;
  profession: string;
  cpfCnpj: string;
  phone1: string;
  phone2?: string;
  email1: string;
  email2?: string;
  isActive: boolean;
  isBlocked: boolean;
  verificationLevel: string;
  blockchainAccounts: [];
}
