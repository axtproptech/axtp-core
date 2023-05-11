import { ServiceContext } from "./serviceContext";
import { ChainValue } from "@signumjs/util";
import { DescriptorDataClient } from "@signumjs/standards";
import { BasicTokenInfo } from "./basicTokenInfo";
import { UnconfirmedAssetBalance } from "@signumjs/core/out/typings/unconfirmedAssetBalance";

export abstract class GenericContractViewerService {
  protected constructor(protected context: ServiceContext) {}

  public abstract contractId(): string;

  protected async getTokenBalances(): Promise<UnconfirmedAssetBalance[]> {
    try {
      const { ledger } = this.context;
      const account = await ledger.account.getAccount({
        accountId: this.contractId(),
        includeCommittedAmount: false,
        includeEstimatedCommitment: false,
      });

      if (account) {
        return account.unconfirmedAssetBalances || [];
      }
    } catch (e) {
      // when a contract is not initialized, it's possible that this call fails...we ignore it
    }
    return [];
  }

  protected async getTokenData(tokenId: string): Promise<BasicTokenInfo> {
    if (!tokenId || tokenId === "0") {
      return Promise.resolve({
        name: "",
        id: "0",
        balance: "0",
        supply: "0",
        numHolders: 0,
        decimals: 0,
      });
    }
    const { ledger } = this.context;
    const [assetInfo, tokenBalances] = await Promise.all([
      ledger.asset.getAsset({ assetId: tokenId }),
      this.getTokenBalances(),
    ]);

    const tokenBalance = tokenBalances.find(({ asset }) => tokenId === asset);
    let balance = "0";
    if (tokenBalance) {
      balance = ChainValue.create(assetInfo.decimals)
        .setAtomic(tokenBalance.unconfirmedBalanceQNT)
        .getCompound();
    }

    const {
      name,
      asset: id,
      quantityCirculatingQNT,
      numberOfAccounts,
    } = assetInfo;
    return {
      name,
      id,
      balance,
      supply: ChainValue.create(assetInfo.decimals)
        .setAtomic(quantityCirculatingQNT)
        .getCompound(),
      decimals: assetInfo.decimals,
      numHolders: numberOfAccounts,
    };
  }

  protected async getAliasName() {
    const { ledger } = this.context;
    const client = new DescriptorDataClient(ledger);
    try {
      const descriptor = await client.getFromContract(this.contractId());
      return descriptor.alias;
    } catch {
      return "";
    }
  }
}
