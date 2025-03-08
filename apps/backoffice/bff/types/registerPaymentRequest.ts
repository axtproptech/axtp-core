export interface RegisterPaymentRequest {
  customerId: string;
  accountPk: string;
  poolId: string;
  tokenId: string;
  tokenQnt: string;
  tokenName: string;
  amount: string;
  paymentType: string;
  txId: string;
  usd: string;
  currency: string;
}
