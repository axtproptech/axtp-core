import { Customer } from "@axtp/db";
import { bffLoggingService } from "@/bff/bffLoggingService";
import { getEnvVar } from "@/bff/getEnvVar";
import { CrmService } from "@axtp/core/crm";

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
    const client = new CrmService(getEnvVar("NEXT_SERVER_BREVO_API_KEY"));
    await client.upsertContract(data);
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
    // no re-throw intended...being a bit more robust.
  }
}
