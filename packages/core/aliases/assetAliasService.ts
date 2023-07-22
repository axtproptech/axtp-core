import { AssetAliasInstanceService } from "./assetAliasInstanceService";
import { AssetAliasServiceContext } from "./assetAliasServiceContext";
import { AssetAlias, AssetAliasData } from "./assetAlias";
import { withError } from "../common/withError";
import { customAlphabet } from "nanoid";
import { Amount } from "@signumjs/util";
import { DescriptorData } from "@signumjs/standards";
import { Alias } from "@signumjs/core";

const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

export type AssetAliasMap = Map<string, AssetAlias>;

interface OnChainWriteable {
  senderPublicKey: string;
  senderPrivateKey?: string;
}

export interface CreateAssetAliasArgs extends OnChainWriteable {
  /**
   * base name, will be extended by a random nanoid, i.e. axtp0001
   */
  aliasBaseName: string;
  aliasTld?: string;
  data: AssetAliasData;
}

export interface UpdateAssetAliasArgs extends OnChainWriteable {
  aliasId: string;
  data: AssetAliasData;
}

export class AssetAliasService {
  constructor(private context: AssetAliasServiceContext) {}

  with(aliasId: string): AssetAliasInstanceService {
    return new AssetAliasInstanceService(this.context, aliasId);
  }

  // FIXME: change the concept.... do not use "next Alias" pattern, but return the aliases by owner.
  // consider potentially more than 500 aliases!
  // filter out all aliases which are not of the asset format
  async fetchAllAssetAliases(baseAlias: Alias) {
    return withError(async () => {
      const { ledger } = this.context;
      let nextAliasName = DescriptorData.parse(baseAlias.aliasURI).alias;
      const assetAliases = new Map<string, AssetAlias>();
      while (nextAliasName) {
        const nextAlias = await ledger.alias.getAliasByName(
          nextAliasName,
          baseAlias.tld
        );

        if (nextAlias.account !== baseAlias.account) {
          throw new Error(
            `Adjacent Aliases have different owners: ${nextAliasName} (${nextAlias.account}) x ${baseAlias.aliasName} (${baseAlias.account})`
          );
        }
        const assetAlias = AssetAlias.parse(nextAlias.aliasURI);
        assetAliases.set(nextAlias.alias, assetAlias);
        nextAliasName = assetAlias.getData().nextAlias ?? "";
      }
      return assetAliases as AssetAliasMap;
    });
  }

  async createAssetAlias({
    aliasBaseName,
    aliasTld,
    data,
    senderPublicKey,
    senderPrivateKey,
  }: CreateAssetAliasArgs) {
    return withError(async () => {
      const { ledger } = this.context;
      const descriptor = AssetAlias.create(data).getDescriptorData();
      return ledger.alias.setAlias({
        aliasName: `${aliasBaseName}_${nanoid()}`,
        tld: aliasTld,
        feePlanck: Amount.fromSigna(0.2).getPlanck(),
        aliasURI: descriptor.stringify(),
        senderPublicKey,
        senderPrivateKey,
        skipAdditionalSecurityCheck: true,
      });
    });
  }
  async updateAssetAlias({
    aliasId,
    data,
    senderPublicKey,
    senderPrivateKey,
  }: UpdateAssetAliasArgs) {
    return withError(async () => {
      const { ledger } = this.context;
      const descriptor = AssetAlias.create(data).getDescriptorData();
      const alias = await ledger.alias.getAliasById(aliasId);
      return ledger.alias.setAlias({
        aliasName: alias.aliasName,
        tld: alias.tldName,
        feePlanck: Amount.fromSigna(0.2).getPlanck(),
        aliasURI: descriptor.stringify(),
        senderPublicKey,
        senderPrivateKey,
        skipAdditionalSecurityCheck: true,
      });
    });
  }
}
