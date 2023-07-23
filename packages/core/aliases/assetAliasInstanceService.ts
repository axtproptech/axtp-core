import { AssetAliasServiceContext } from "./assetAliasServiceContext";
import { withError } from "../common/withError";
import { AssetAlias } from "./assetAlias";

export class AssetAliasInstanceService {
  constructor(
    private context: AssetAliasServiceContext,
    private aliasId: string
  ) {}

  async fetchAlias() {
    return withError(async () =>
      this.context.ledger.alias.getAliasById(this.aliasId)
    );
  }
  async fetchAliasData() {
    return withError(async () => {
      const alias = await this.fetchAlias();
      return AssetAlias.parse(alias.aliasURI);
    });
  }
}
