// @ts-ignore
import * as Brevo from "@getbrevo/brevo";
import { BrevoError } from "../errors/brevoError";

export class CrmServiceError extends BrevoError {}

export enum ContactListType {
  KycCompleted = 7,
}

export interface CreateContactArgs {
  email: string;
  cuid: string;
  cpfCnpj: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date | null;
  isTokenHolder?: boolean;
  /**
   * The Brevo contact list, where this user belongs to.
   * @default [ContactListType.KycCompleted]
   */
  contactLists?: (ContactListType | number)[];
}

export interface UpdateContactArgs {
  email: string;
  cuid: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date;
  isTokenHolder: boolean;
  isVerified: boolean;
}

/**
 * Client to interact with Brevo CRM
 */
export class CrmService {
  private contactsApi = new Brevo.ContactsApi();

  constructor(apiKey: string) {
    Brevo.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  }

  /**
   * Creates a new contact in CRM
   * @note by default creates inside KycCompleted list
   * @param args
   */
  public async createNewContact(args: CreateContactArgs) {
    try {
      const contact = new Brevo.CreateContact();
      contact.email = args.email;
      contact.ext_id = args.cuid; // not sure where to see this in brevo!
      contact.listIds = args.contactLists ?? [ContactListType.KycCompleted];
      // Fields are defined in Brevo by AXT - and must be uppercase
      contact.attributes = {
        CUID: args.cuid,
        FIRSTNAME: args.firstName,
        LASTNAME: args.lastName,
        PHONE: args.phone,
        CPF: args.cpfCnpj,
        BIRTHDATE: args.birthDate,
        IS_TOKENHOLDER: false,
        IS_VERIFIED: false,
      };

      await this.contactsApi.createContact(contact);
    } catch (e: any) {
      throw new CrmServiceError(e);
    }
  }

  public async updateContact(args: UpdateContactArgs) {
    try {
      const contact = new Brevo.UpdateContact();
      // TODO:
      await this.contactsApi.updateContact(contact);
    } catch (e: any) {
      throw new CrmServiceError(e);
    }
  }
}
