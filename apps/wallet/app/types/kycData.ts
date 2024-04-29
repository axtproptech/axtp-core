export interface InitialSetupStep {
  firstName: string;
  lastName: string;
  email: string;
  code: string;
}

export interface SecondStep {
  cpf: string;
  birthDate: string;
  birthPlace: string;
}

export interface ThirdStep {
  phone: string;
  profession: string;
  pep: boolean;
}

export interface FourthStep {
  streetAddress: string;
  complementaryStreetAddress: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  proofOfAddress: string;
}

export interface MotherDataStep {
  firstNameMother: string;
  lastNameMother: string;
}

export interface DocumentStep {
  documentType: "cnh" | "rne";
  frontSide: string;
  backSide: string;
}
