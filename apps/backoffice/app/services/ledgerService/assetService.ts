import { ServiceContext } from "./serviceContext";
import {
  AssetAlias,
  AssetAliasData,
  AssetAliasService,
  type AssetAliasMap,
} from "@axtp/core/aliases";
import { Alias, TransactionId } from "@signumjs/core";
import { PoolContractService } from "@/app/services/ledgerService/poolContractService";
import { HttpClientFactory } from "@signumjs/http";
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
      const { ledger, principalAccountId } = this.context;
      return this.assetAliasService.fetchAllAssetAliases(
        principalAccountId,
        poolId
      );
    });
  }

  async createAssetOnPool(data: AssetAliasData) {
    return withError<TransactionId>(async () => {
      const baseAlias = await this.fetchPoolBaseAlias(data.poolId);
      // We create the alias in the name of axtp principal account... secret is kept server side.
      const http = HttpClientFactory.createHttpClient("/api/admin");
      const { response } = await http.post("/assets", {
        aliasBaseName: baseAlias.aliasName,
        aliasTld: baseAlias.tld,
        ...data,
      });

      return response as TransactionId;
    });
  }

  async updateAsset(aliasId: string, data: AssetAliasData) {
    return withError<TransactionId>(async () => {
      // We update the alias in the name of axtp principal account... secret is kept server side.
      const http = HttpClientFactory.createHttpClient("/api/admin");
      const { response } = await http.put("/assets", {
        aliasId,
        ...data,
      });
      return response as TransactionId;
    });
  }
}
