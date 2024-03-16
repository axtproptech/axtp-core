import { AssetAccount, Ledger, LedgerClientFactory } from "@signumjs/core";

type WithAllTokenHoldersFunction = (
  tokenHolders: AssetAccount[],
  leder: Ledger
) => Promise<void>;

interface WithAllTokenHoldersArgs {
  actionFunc: WithAllTokenHoldersFunction;
  tokenId: string;
  concurrency?: number;
}

export class Service {
  private _ledger: Ledger;

  constructor({ ledger }: { ledger: Ledger }) {
    this._ledger = ledger;
  }

  get ledger() {
    return this._ledger;
  }

  async withAllTokenHolders({
    tokenId,
    actionFunc,
    concurrency = 20,
  }: WithAllTokenHoldersArgs) {
    const { accountAssets } = await this.ledger.asset.getAssetHolders({
      assetId: tokenId,
      ignoreTreasuryAccount: true,
    });
    while (accountAssets.length) {
      await actionFunc(accountAssets.splice(0, concurrency), this.ledger);
    }
  }
}

export const MainNetService = new Service({
  ledger: LedgerClientFactory.createClient({
    nodeHost: "http://localhost:8125",
  }),
});
export const TestNetService = new Service({
  ledger: LedgerClientFactory.createClient({
    nodeHost: "http://localhost:6876",
  }),
});
