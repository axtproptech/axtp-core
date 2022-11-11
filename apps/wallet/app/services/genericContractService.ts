import { ServiceContext } from "./serviceContext";
import { DefaultTokenData, TokenData } from "@/types/tokenData";
import { ChainValue } from "@signumjs/util";

export abstract class GenericContractService {
  protected constructor(protected context: ServiceContext) {}

  public abstract contractId(): string;

  protected async getTokenData(tokenId: string): Promise<TokenData> {
    if (!tokenId || tokenId === "0") {
      return Promise.resolve(DefaultTokenData);
    }
    const { ledger } = this.context;
    const assetInfo = await ledger.asset.getAsset({ assetId: tokenId });
    const { name, asset, quantityCirculatingQNT, decimals, numberOfAccounts } =
      assetInfo;
    return {
      name,
      id: asset,
      decimals,
      supply: ChainValue.create(decimals)
        .setAtomic(quantityCirculatingQNT)
        .getCompound(),
      numHolders: numberOfAccounts,
    };
  }
}
