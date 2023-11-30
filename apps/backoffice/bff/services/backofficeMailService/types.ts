export interface MailRecipient {
  firstName: string;
  lastName: string;
  email1: string;
}

export interface Mail<PARAMS> {
  to: MailRecipient;
  params: PARAMS;
}
