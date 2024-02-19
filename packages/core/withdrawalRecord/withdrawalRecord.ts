export type WithdrawalPaymentType =
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
  tokenDecimals: number;
  paymentType: WithdrawalPaymentType;
  paymentTransactionId: string;
  paymentAmount: string;
  paymentUsd: string;
  paymentCurrency: string;
}
