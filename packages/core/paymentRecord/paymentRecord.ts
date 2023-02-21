export type PaymentType = "pix" | "usdeth" | "usdsol" | "usdalg";

export interface PaymentRecord {
  customerId: string;
  accountId: string;
  poolId: string;
  tokenQuantity: string;
  tokenId: string;
  paymentType: PaymentType;
  paymentTransactionId: string;
  paymentAmount: string;
  paymentUsd: string;
  paymentCurrency: string;
}
