import { AssetAliasServiceContext } from "./assetAliasServiceContext";
import { withError } from "../common/withError";
import { AssetAlias } from "./assetAlias";
import { TransactionArbitrarySubtype, TransactionType } from "@signumjs/core";
import { AssetAliasHistoryItem } from "./assetAliasHistoryItem";

interface FetchAliasHistoryArgs {
  timestamp?: number;
}

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

  async fetchAliasHistory(args: FetchAliasHistoryArgs) {
    return withError(async () => {
      const { ledger } = this.context;
      const { timestamp = 0 } = args;
      const thisAlias = await this.fetchAlias();
      let history: AssetAliasHistoryItem[] = [];
      let firstIndex: number | undefined = 0;
      while (firstIndex !== undefined) {
        // @ts-ignore
        const { nextIndex, transactions } =
          await ledger.account.getAccountTransactions({
            accountId: thisAlias.account,
            timestamp: timestamp.toString(),
            type: TransactionType.Arbitrary,
            subtype: TransactionArbitrarySubtype.AliasAssignment,
            firstIndex,
          });

        for (let tx of transactions) {
          const al = tx.attachment.alias as string;
          const tld = tx.attachment.tld as string;
          if (al !== thisAlias.aliasName) continue;
          if (tld !== thisAlias.tld) continue;
          try {
            const assetData = AssetAlias.parse(
              tx.attachment.uri || ""
            ).getData();
            history.push({
              assetData,
              timestamp: tx.timestamp,
              transactionId: tx.transaction,
            });
          } catch (e) {
            // ignore this invalid item
          }
        }

        firstIndex = nextIndex;
      }
      return history;
    });
  }
}
