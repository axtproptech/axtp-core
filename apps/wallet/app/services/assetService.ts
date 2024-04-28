import { ServiceContext } from "./serviceContext";
import {
  AssetAlias,
  AssetAliasService,
  type AssetAliasMap,
  AssetAliasHistory,
} from "@axtp/core/aliases";
import { PoolContractService } from "./poolContractService";
import { withError } from "@axtp/core";

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

  async fetchAllPoolAssetHistory(aliasId: string, timestamp?: number) {
    return withError<AssetAliasHistory>(async () => {
      return this.assetAliasService
        .with(aliasId)
        .fetchAliasHistory({ timestamp });
    });
  }
}
