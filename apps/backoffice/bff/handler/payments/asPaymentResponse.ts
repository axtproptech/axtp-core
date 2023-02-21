import { PaymentResponse } from "@/bff/types/paymentResponse";

export function asPaymentResponse(payment: any): PaymentResponse {
  payment.cuid = payment.customer.cuid;
  delete payment.customer;

  return payment as PaymentResponse;
}
