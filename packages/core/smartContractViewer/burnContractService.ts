import { Ledger } from "@signumjs/core";
import { withError } from "../common/withError";
import { ChainValue } from "@signumjs/util";
import { BaseContractViewerService } from "./baseContractViewerService";

export const BurnContractContext = {
  CodeHashId: "10089491455344783515",
  ActivationFee: 3000_0000,
  Methods: {
    AddTrackableToken: 1,
    RemoveTrackableToken: 2,
    CreditTrackableToken: 3,
  },
  Maps: {
    TrackableTokens: "1",
    // other map is dynamic by token ids
  },
};

export interface TokenCredit {
  id: string;
  name: string;
  decimals: number;
  amount: ChainValue;
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
        .map(({ value }) => value);
    });
  }

  /**
   * Gets an accounts token credits.
   * Token credits are registered amounts for payout request (Withdrawal) in FIAT (to be paid off-chain/banking)
   * @param accountId
   */
  async getAccountTokenCredits(accountId: string): Promise<TokenCredit[]> {
    return withError<TokenCredit[]>(async () => {
      const accountTokens =
        await this.ledger.contract.getContractMapValuesByFirstKey({
          contractId: this.contractId(),
          key1: accountId,
        });
      const tokensWithBalance = accountTokens.keyValues
        .filter(({ value }) => value != "0")
        .reduce((acc, curr) => {
          acc[curr.key2] = curr.value;
          return acc;
        }, {} as Record<string, string>);

      const tokenIds = Object.keys(tokensWithBalance).map((id) => id);
      const tokenInfos = await Promise.all(
        tokenIds.map((tokenId) => this.getTokenData(tokenId, false))
      );
      return tokenInfos.map<TokenCredit>((info) => ({
        amount: ChainValue.create(info.decimals).setAtomic(
          tokensWithBalance[info.id]
        ),
        decimals: info.decimals,
        name: info.name,
        id: info.id,
      }));
    });
  }
}
