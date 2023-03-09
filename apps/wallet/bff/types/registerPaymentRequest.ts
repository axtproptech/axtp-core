export type RegisterPaymentType =
  | "pix"
  | "usdeth"
  | "usdsol"
  | "usdalg"
  | "usdmat";

export interface RegisterPaymentRequest {
  customerId: string;
  accountPk: string;
  poolId: string;
  tokenId: string;
  tokenQnt: string;
  amount: string;
  paymentType: RegisterPaymentType;
  txId: string;
  usd: string;
  currency: string;
}
