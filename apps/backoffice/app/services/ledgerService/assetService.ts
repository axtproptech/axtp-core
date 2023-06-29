import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import {
  AssetAlias,
  AssetAliasData,
  AssetAliasService,
  type AssetAliasMap,
} from "@axtp/core";
import { Alias, UnsignedTransaction } from "@signumjs/core";
import { PoolContractService } from "@/app/services/ledgerService/poolContractService";
import { ConfirmedTransaction } from "@signumjs/wallets";

export class AssetService {
  private assetAliasService: AssetAliasService;
  constructor(
    private context: ServiceContext,
    private poolService: PoolContractService
  ) {
    this.assetAliasService = new AssetAliasService({
      ledger: context.ledger,
    });
  }

  private async fetchPoolBaseAlias(poolId: string) {
    return withError<Alias>(async () => {
      const { ledger } = this.context;
      const poolDescriptor = await this.poolService
        .with(poolId)
        .fetchDescriptor();
      return ledger.alias.getAliasByName(poolDescriptor.alias);
    });
  }

  async fetchAssetData(aliasId: string) {
    return withError<AssetAlias>(async () => {
      const { ledger } = this.context;
      const alias = await ledger.alias.getAliasById(aliasId);
      return AssetAlias.parse(alias.aliasURI);
    });
  }

  async fetchAllPoolAssetsData(poolId: string) {
    return withError<AssetAliasMap>(async () => {
      const { ledger } = this.context;
      const baseAlias = await this.fetchPoolBaseAlias(poolId);
      return this.assetAliasService.fetchAllAssetAliases(baseAlias);
    });
  }

  async createAssetOnPool(poolId: string, data: AssetAliasData) {
    return withError<ConfirmedTransaction>(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const baseAlias = await this.fetchPoolBaseAlias(poolId);
      const { unsignedTransactionBytes } =
        (await this.assetAliasService.createAssetAlias({
          aliasBaseName: baseAlias.aliasName,
          aliasTld: baseAlias.tldName,
          data,
          senderPublicKey: accountPublicKey,
        })) as UnsignedTransaction;
      return this.signWithWallet(unsignedTransactionBytes);
    });
  }

  async updateAsset(aliasId: string, data: AssetAliasData) {
    return withError<ConfirmedTransaction>(async () => {
      const { ledger, accountPublicKey, wallet } = this.context;
      const { unsignedTransactionBytes } =
        (await this.assetAliasService.updateAssetAlias({
          aliasId,
          data,
          senderPublicKey: accountPublicKey,
        })) as UnsignedTransaction;
      return this.signWithWallet(unsignedTransactionBytes);
    });
  }

  private async signWithWallet(unsignedTransactionBytes: string) {
    return (await this.context.wallet.confirm(
      unsignedTransactionBytes
    )) as ConfirmedTransaction;
  }
}
