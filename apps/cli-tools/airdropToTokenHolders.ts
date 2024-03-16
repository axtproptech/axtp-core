import { TestNetService, MainNetService } from "./service";
import { AssetAccount, Ledger } from "@signumjs/core";
import { Amount } from "@signumjs/util";
import { generateMasterKeys } from "@signumjs/crypto";

const AXTP0001 = "6199612279657926604";
const TAXTP001 = "5885513911579683933";

const SigningKeys = generateMasterKeys(
  "gym crumble turn daring twin crawl orphan grief fury conduct cram hold"
);

async function airdropToTokenHolders(
  tokenHolders: AssetAccount[],
  ledger: Ledger
) {
  await ledger.transaction.sendSameAmountToMultipleRecipients({
    recipientIds: tokenHolders.map((t) => t.account),
    feePlanck: Amount.fromSigna(0.06).getPlanck(),
    amountPlanck: Amount.fromSigna(1).getPlanck(),
    deadline: 60,
    senderPrivateKey: SigningKeys.signPrivateKey,
    senderPublicKey: SigningKeys.publicKey,
  });
  console.info("Airdropped to:");
  console.table(tokenHolders);
}

async function run() {
  try {
    await TestNetService.withAllTokenHolders({
      tokenId: TAXTP001,
      actionFunc: airdropToTokenHolders,
      concurrency: 128,
    });
  } catch (e: any) {
    console.error("Error while running airdropToTokenHolders");
  }
}

run();
