// @ts-ignore
import * as Brevo from "@getbrevo/brevo";
import { BrevoError } from "../errors/brevoError";

export class CrmServiceError extends BrevoError {}

export enum ContactListType {
  KycCompleted = 7,
  TokenHolder = 8,
  LandingLeads = 10,
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
  firstName?: string;
  lastName?: string;
  phone?: string;
  cpfCnpj?: string;
  birthDate?: Date | null;
  isTokenHolder?: boolean;
  isVerified?: boolean;
}

/**
 * Client to interact with Brevo CRM
 */
export class CrmService {
  private contactsApi = new Brevo.ContactsApi();

  constructor(apiKey: string) {
    Brevo.ApiClient.instance.authentications["api-key"].apiKey = apiKey;
  }

  public async contactExists(email: string) {
    try {
      await this.contactsApi.getContactInfo(email);
      return true;
    } catch (e: any) {
      return false;
    }
  }

  public async upsertContract(args: CreateContactArgs): Promise<void> {
    try {
      const contactExists = await this.contactExists(args.email);
      if (contactExists) {
        await this.updateContact(args);
      } else {
        await this.createNewContact(args);
      }
    } catch (e: any) {
      throw new CrmServiceError(e);
    }
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

  /**
   * Updates an existing contact
   * Partial update is possible
   * @param args
   */
  public async updateContact(args: UpdateContactArgs) {
    try {
      const contact = new Brevo.UpdateContact();
      contact.attributes = {
        FIRSTNAME: args.firstName,
        LASTNAME: args.lastName,
        PHONE: args.phone,
        CPF: args.cpfCnpj,
        BIRTHDATE: args.birthDate,
        IS_TOKENHOLDER: args.isTokenHolder ?? false,
        IS_VERIFIED: args.isVerified ?? false,
      };
      if (args.isTokenHolder) {
        contact.listIds = [
          ContactListType.TokenHolder,
          ContactListType.KycCompleted,
        ];
      } else {
        contact.listIds = [ContactListType.KycCompleted];
      }
      await this.contactsApi.updateContact(args.email, contact);
    } catch (e: any) {
      throw new CrmServiceError(e);
    }
  }
}
