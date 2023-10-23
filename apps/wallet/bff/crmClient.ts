// @ts-ignore
import * as Brevo from "@getbrevo/brevo";

interface CreateContactArgs {
  email: string;
  cuid: string;
  cpfCnpj: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date | null;
  isTokenHolder?: boolean;
}

interface UpdateContactArgs {
  email: string;
  cuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date;
  isTokenHolder: boolean;
  isVerified: boolean;
}

const ContactListId = {
  KycCompleted: 7,
};

// This is a candidate for @axtp/core, as we will need to update customers/users from the backoffice also...
export class CrmClient {
  private contactsApi = new Brevo.ContactsApi();

  constructor(apiKey: string) {
    Brevo.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  }

  public async createNewContact(args: CreateContactArgs) {
    const contact = new Brevo.CreateContact();
    contact.email = args.email;
    contact.ext_id = args.cuid; // not sure where to see this in brevo!
    contact.listIds = [ContactListId.KycCompleted];
    contact.attributes = {
      CUID: args.cuid,
      FIRSTNAME: args.firstName,
      LASTNAME: args.lastName,
      PHONE: args.phone,
      SMS: args.phone,
      CPF: args.cpfCnpj,
      BIRTHDATE: args.birthDate,
      IS_TOKENHOLDER: false,
      IS_VERIFIED: false,
    };

    return this.contactsApi.createContact(contact);
  }

  public async updateContact(args: UpdateContactArgs) {
    throw new Error("Not implemented yet");
    // const contact = new Brevo.UpdateContact()
  }
}
