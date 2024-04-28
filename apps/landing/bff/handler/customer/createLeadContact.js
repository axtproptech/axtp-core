import { ContactListType, CrmService } from "@axtp/core";

const Env = {
  BrevoApiKey: process.env.NEXT_SERVER_BREVO_API_KEY || "",
};

export async function createLeadContact({
  cuid,
  firstName,
  lastName,
  phone = "",
  email,
  isBrazilian,
}) {
  const crmService = new CrmService(Env.BrevoApiKey);
  console.log("Creating new Lead Contact....");
  await crmService.createNewContact({
    cuid,
    email,
    firstName,
    lastName,
    phone,
    isBrazilian,
    isTokenHolder: false,
    cpfCnpj: "",
    birthDate: null,
    contactLists: [ContactListType.LandingLeads],
  });
  console.info(`New Lead Contact Created on in Brevo: ${email}`);
}
