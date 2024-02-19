import { Ledger } from "@signumjs/core";
import { withError } from "../common/withError";
import { BaseContractViewerService } from "./baseContractViewerService";

export const BurnContractContext = {
  CodeHashId: "4258024526314495767",
  ActivationFee: 2500_0000,
  Methods: {
    AddTrackableToken: "1",
    RemoveTrackableToken: "2",
    CreditTrackableToken: "3",
    AddCreditor: "4",
    RemoveCreditor: "5",
  },
  Maps: {
    TrackableTokens: "1",
    CreditorAccounts: "2",
    // other map is dynamic by token ids
  },
};

interface AccountCredit {
  accountId: string;
  creditQuantity: string;
}

export interface TokenAccountCredits {
  tokenId: string;
  accountCredits: AccountCredit[];
}

export class BurnContractService extends BaseContractViewerService {
  constructor(ledger: Ledger, private burnContractId: string) {
    super(ledger);
  }

  public contractId(): string {
    return this.burnContractId;
  }

  /**
   * Gets a list of tracked tokens to be credited.
   */
  async getTrackedTokenIds(): Promise<string[]> {
    return withError<string[]>(async () => {
      const result = await this.ledger.contract.getContractMapValuesByFirstKey({
        contractId: this.contractId(),
        key1: BurnContractContext.Maps.TrackableTokens,
      });
      return result.keyValues
        .filter(({ value }) => value != "0")
        .map(({ key2 }) => key2);
    });
  }

  /**
   * Gets a list of creditor accounts, i.e. accounts to be allowed to credit token credits.
   */
  async getCreditorAccounts(): Promise<string[]> {
    return withError<string[]>(async () => {
      const result = await this.ledger.contract.getContractMapValuesByFirstKey({
        contractId: this.contractId(),
        key1: BurnContractContext.Maps.CreditorAccounts,
      });
      return result.keyValues
        .filter(({ value }) => value != "0")
        .map(({ key2 }) => key2);
    });
  }

  /**
   * Gets all creditable accounts for a token, i.e. all pending withdrawals
   * @param tokenId The token id
   * @return {TokenAccountCredits} The list of credits per account per token
   */
  async getTokenAccountCredits(tokenId: string): Promise<TokenAccountCredits> {
    return withError<TokenAccountCredits>(async () => {
      const tokenCredits =
        await this.ledger.contract.getContractMapValuesByFirstKey({
          contractId: this.contractId(),
          key1: tokenId,
        });

      const accountCredits = tokenCredits.keyValues
        .filter(({ value }) => Number(value) > 0)
        .map(({ key2, value }) => ({
          creditQuantity: value,
          accountId: key2,
        }));

      return {
        tokenId,
        accountCredits,
      };
    });
  }
}
