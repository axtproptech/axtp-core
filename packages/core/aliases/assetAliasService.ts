import { AssetAliasInstanceService } from "./assetAliasInstanceService";
import { AssetAliasServiceContext } from "./assetAliasServiceContext";
import { AssetAlias, AssetAliasData } from "./assetAlias";
import { withError } from "../common/withError";
import { customAlphabet } from "nanoid";
import { Amount } from "@signumjs/util";

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

  async fetchAllAssetAliases(accountId: string, poolId?: string) {
    return withError(async () => {
      const { ledger } = this.context;
      const assetAliases = new Map<string, AssetAlias>();
      let firstIndex: number | undefined = 0;
      while (firstIndex !== undefined) {
        // @ts-ignore
        const { aliases, nextIndex } = await ledger.alias.getAliases({
          firstIndex,
          accountId,
        });
        firstIndex = nextIndex;
        for (let alias of aliases) {
          try {
            const assetAlias = AssetAlias.parse(alias.aliasURI);
            const isValid = poolId
              ? assetAlias.isValid() && poolId === assetAlias.getData().poolId
              : assetAlias.isValid();
            if (!isValid) continue;
            assetAliases.set(alias.aliasName, assetAlias);
          } catch (e: any) {
            // ignore as not compatible alias
          }
        }
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
        tld: aliasTld && aliasTld !== "0" ? aliasTld : undefined,
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
