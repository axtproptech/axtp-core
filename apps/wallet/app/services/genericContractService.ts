import { ServiceContext } from "./serviceContext";
import { DefaultTokenData, TokenData } from "@/types/tokenData";
import { ChainValue } from "@signumjs/util";
import {
  Descriptor,
  DescriptorData,
  DescriptorDataBuilder,
  DescriptorDataClient,
} from "@signumjs/standards";
import { Contract } from "@signumjs/contracts";

const DefaultDescriptor = DescriptorDataBuilder.create().build().get();

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

  protected async getSRC44AliasDataFromContract(
    contract: Contract
  ): Promise<Descriptor> {
    try {
      const d = DescriptorData.parse(contract.description);
      return await this.getSRC44AliasData(d.alias);
    } catch (e) {
      return DefaultDescriptor;
    }
  }
  protected async getSRC44AliasData(aliasName: string): Promise<Descriptor> {
    if (!aliasName) {
      return Promise.resolve(DefaultDescriptor);
    }
    try {
      const descriptorDataClient = new DescriptorDataClient(
        this.context.ledger
      );
      return await descriptorDataClient.getFromAlias(aliasName);
    } catch (e) {
      return DefaultDescriptor;
    }
  }
}
