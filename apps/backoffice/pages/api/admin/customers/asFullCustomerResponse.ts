import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { sanitizeUrl } from "@braintree/sanitize-url";

export function asFullCustomerResponse(customer: any): CustomerFullResponse {
  customer.documents.forEach((d: any) => {
    try {
      const sanitized = sanitizeUrl(d.url);
      const url = new URL(sanitized);
      // This is not really a good idea...but vercel has a limit of 4,5 MB per download....
      // We need to see how we can access more securely... at least only authenticated users have access to this endpoing
      url.searchParams.append("apiKey", process.env.JOTFORM_API_KEY || "");
      d.url = url.toString();
    } catch (e) {
      d.url = "";
    }
  });

  return customer as CustomerFullResponse;
}
