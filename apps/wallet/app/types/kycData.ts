export type InitialStep = {
  firstName: string;
  lastName: string;
  email: string;
  code: string;
};

export type SecondStep = {
  cpf: string;
  birthDate: string;
  birthPlace: string;
};

export type ThirdStep = {
  phone: string;
  profession: string;
};

export type FourthStep = {
  streetAddress: string;
  complementaryStreetAddress: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  proofOfAddress: string;
};

export type MotherDataStep = {
  firstName: string;
  lastName: string;
};

export type DocumentStep = {
  documentType: "cnh" | "rne";
  frontSide: string;
  backSide: string;
};

export type BlockchainAccountStep = {
  accountId: string;
  accountSeedPhrase: string;
  agreeSafetyTerms: boolean;
};
