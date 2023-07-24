import { ServiceContext } from "./serviceContext";
import { withError } from "./withError";
import {
  AssetAlias,
  AssetAliasData,
  AssetAliasService,
  type AssetAliasMap,
} from "@axtp/core";
import { Alias, TransactionId } from "@signumjs/core";
import { PoolContractService } from "./poolContractService";
import { HttpClientFactory } from "@signumjs/http";

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

  async fetchAssetData(aliasId: string) {
    return withError<AssetAlias>(async () => {
      const { ledger } = this.context;
      const alias = await ledger.alias.getAliasById(aliasId);
      return AssetAlias.parse(alias.aliasURI);
    });
  }

  async fetchAllPoolAssetsData(poolId: string) {
    return withError<AssetAliasMap>(async () => {
      const { ledger, principalAccount } = this.context;
      return this.assetAliasService.fetchAllAssetAliases(
        principalAccount,
        poolId
      );
    });
  }

  // TODO: fetch AssetHistory
  // use timestamp and make it incremental
}
