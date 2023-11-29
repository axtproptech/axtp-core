// ids from Brevo templates
export enum EmailTemplates {
  ExclusiveAreaInvitation = 6,
  SuccessfulVerification,
  PaymentReceived,
}

export enum InternalEmailTemplates {
  CustomerUpdated = 8,
}

export interface MailRecipient {
  firstName: string;
  lastName: string;
  email1: string;
}

export interface Mail<PARAMS> {
  to: MailRecipient;
  params: PARAMS;
}
