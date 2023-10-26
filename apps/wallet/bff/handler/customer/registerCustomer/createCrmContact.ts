import { Customer } from "@axtp/db";
import { CrmClient } from "@/bff/crmClient";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { getEnvVar } from "@/bff/getEnvVar";

export async function createCrmContact(newCustomer: Customer) {
  const data = {
    cuid: newCustomer.cuid,
    cpfCnpj: newCustomer.cpfCnpj,
    firstName: newCustomer.firstName,
    lastName: newCustomer.lastName,
    email: newCustomer.email1,
    phone: newCustomer.phone1,
    birthDate: newCustomer.dateOfBirth,
    isTokenHolder: false,
  };
  try {
    bffLoggingService.info({
      msg: "Creating new contact in CRM",
      domain: "customer",
      detail: { cpfCnpj: newCustomer.cpfCnpj, cuid: newCustomer.cuid },
    });
    const client = new CrmClient(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
    await client.createNewContact(data);
  } catch (e: any) {
    bffLoggingService.error({
      msg: "Error creating new contact in CRM: " + e.message,
      domain: "customer",
      detail: {
        cpfCnpj: newCustomer.cpfCnpj,
        cuid: newCustomer.cuid,
        data,
        detail: e.text,
      },
    });
    throw e;
  }
}
