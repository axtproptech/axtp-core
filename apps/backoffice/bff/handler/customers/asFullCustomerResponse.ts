import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { sanitizeUrl } from "@braintree/sanitize-url";

export function asFullCustomerResponse(customer: any): CustomerFullResponse {
  customer.documents.forEach((d: any) => {
    try {
      const sanitized = sanitizeUrl(d.url);
      const url = new URL(sanitized);
      d.url = url.toString();
    } catch (e) {
      d.url = "";
    }
  });

  return customer as CustomerFullResponse;
}
