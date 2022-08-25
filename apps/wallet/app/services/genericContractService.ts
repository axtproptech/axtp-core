import { ServiceContext } from "./serviceContext";
import { fromQuantity, toStableCoinAmount } from "../tokenQuantity";
import { DefaultTokenData, TokenData } from "@/types/tokenData";

export abstract class GenericContractService {
  protected constructor(protected context: ServiceContext) {}

  public abstract contractId(): string;

  protected async getTokenData(tokenId: string): Promise<TokenData> {
    if (!tokenId || tokenId === "0") {
      return Promise.resolve(DefaultTokenData);
    }
    const { ledger } = this.context;
    const [assetInfo, accountInfo] = await Promise.all([
      ledger.asset.getAsset({ assetId: tokenId }),
      ledger.account.getAccount({
        accountId: this.contractId(),
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      }),
    ]);

    // TODO: adjust signumjs with new quantityCirculatingQNT
    // @ts-ignore
    const { name, asset, quantityCirculatingQNT, decimals, numberOfAccounts } =
      assetInfo;
    return {
      name,
      id: asset,
      decimals,
      supply: toStableCoinAmount(quantityCirculatingQNT),
      numHolders: numberOfAccounts,
    };
  }
}
