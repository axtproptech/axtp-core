export type PaymentType =
  | "pix"
  | "usdeth"
  | "usdsol"
  | "usdalg"
  | "usdmat"
  | "iban";

export interface WithdrawalRecord {
  customerId: string;
  accountId: string;
  tokenQuantity: string;
  tokenId: string;
  tokenName: string;
  paymentType: PaymentType;
  paymentTransactionId: string;
  paymentAmount: string;
  paymentUsd: string;
  paymentCurrency: string;
}
