import { Customer } from "@axtp/db";
import { CrmClient } from "@/bff/crmClient";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { getEnvVar } from "@/bff/getEnvVar";

export async function createCrmContact(newCustomer: Customer) {
  bffLoggingService.info({
    msg: "Creating new contact in CRM",
    domain: "crm",
    detail: { cpfCnpj: newCustomer.cpfCnpj, cuid: newCustomer.cuid },
  });
  const client = new CrmClient(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
  return client.createNewContact({
    cuid: newCustomer.cuid,
    cpfCnpj: newCustomer.cpfCnpj,
    firstName: newCustomer.firstName,
    lastName: newCustomer.lastName,
    email: newCustomer.email1,
    phone: newCustomer.phone1,
    birthDate: newCustomer.dateOfBirth,
    isTokenHolder: false,
  });
}
