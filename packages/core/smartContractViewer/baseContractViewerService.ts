import { ChainValue } from "@signumjs/util";
import { DescriptorDataClient } from "@signumjs/standards";
import { BasicTokenInfo } from "./basicTokenInfo";
import { UnconfirmedAssetBalance } from "@signumjs/core/out/typings/unconfirmedAssetBalance";
import { Ledger } from "@signumjs/core";

export abstract class BaseContractViewerService {
  protected constructor(protected _ledger: Ledger) {}

  get ledger(): Ledger {
    return this._ledger;
  }

  public abstract contractId(): string;

  protected async getTokenBalances(): Promise<UnconfirmedAssetBalance[]> {
    try {
      const account = await this.ledger.account.getAccount({
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

  protected async getTokenData(
    tokenId: string,
    withBalance = true
  ): Promise<BasicTokenInfo> {
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

    let balance = "";
    let assetInfo;
    if (withBalance) {
      const [_assetInfo, tokenBalances] = await Promise.all([
        this.ledger.asset.getAsset({ assetId: tokenId }),
        this.getTokenBalances(),
      ]);
      assetInfo = _assetInfo;
      const tokenBalance = tokenBalances.find(({ asset }) => tokenId === asset);
      if (tokenBalance) {
        balance = ChainValue.create(assetInfo.decimals)
          .setAtomic(tokenBalance.unconfirmedBalanceQNT)
          .getCompound();
      }
    } else {
      assetInfo = await this.ledger.asset.getAsset({ assetId: tokenId });
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
    const client = new DescriptorDataClient(this.ledger);
    try {
      const descriptor = await client.getFromContract(this.contractId());
      return descriptor.alias;
    } catch {
      return "";
    }
  }
}
