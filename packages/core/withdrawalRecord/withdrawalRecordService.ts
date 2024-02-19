import {
  Address,
  Ledger,
  TransactionArbitrarySubtype,
  TransactionId,
  TransactionType,
} from "@signumjs/core";
import {
  createSRC44WithdrawalRecord,
  getWithdrawalRecordFromSRC44,
  readSRC44WithdrawalFromTransaction,
} from "./withdrawalRecordHelper";
import { generateMasterKeys } from "@signumjs/crypto";
import { Amount, ChainValue } from "@signumjs/util";
import { WithdrawalRecord } from "./withdrawalRecord";

interface WithdrawalRecordServiceContext {
  ledger: Ledger;
  senderSeed: string;
  sendFee: Amount;
}

export class WithdrawalRecordService {
  constructor(private context: WithdrawalRecordServiceContext) {}

  private getKeys() {
    return generateMasterKeys(this.context.senderSeed);
  }

  public async sendWithdrawalRecord(
    record: WithdrawalRecord,
    recipientPublicKey: string
  ) {
    const { publicKey, signPrivateKey, agreementPrivateKey } = this.getKeys();

    const src44Data = createSRC44WithdrawalRecord(record);

    return (await this.context.ledger.message.sendEncryptedMessage({
      message: src44Data.stringify(),
      messageIsText: true,
      recipientId: Address.fromPublicKey(recipientPublicKey).getNumericId(),
      recipientPublicKey: recipientPublicKey,
      deadline: 1440,
      feePlanck: this.context.sendFee.getPlanck(),
      senderPublicKey: publicKey,
      senderPrivateKey: signPrivateKey,
      senderAgreementKey: agreementPrivateKey,
    })) as TransactionId;
  }

  public async getAllWithdrawalRecordsFromChain(
    recipientPublicKey: string,
    recipientAgreementKey: string
  ) {
    const { ledger } = this.context;
    const accountId = Address.fromPublicKey(recipientPublicKey).getNumericId();

    let records: WithdrawalRecord[] = [];
    let hasMore = true;
    let firstIndex = 0;
    let lastIndex = 499;
    while (hasMore) {
      const { transactions } = await ledger.account.getAccountTransactions({
        type: TransactionType.Arbitrary,
        subtype: TransactionArbitrarySubtype.Message,
        includeIndirect: false,
        firstIndex,
        lastIndex,
        accountId,
      });

      for (let tx of transactions) {
        try {
          records.push(
            getWithdrawalRecordFromSRC44(
              readSRC44WithdrawalFromTransaction(tx, recipientAgreementKey)
            )
          );
        } catch (e: any) {
          // ignore
        }
      }

      hasMore = transactions.length === 500;
      firstIndex = lastIndex + 1;
      lastIndex += 499;
    }

    return records;
  }

  public async sendWithdrawalReceiptToCustomer(
    record: WithdrawalRecord,
    customerPublicKey: string
  ) {
    const { ledger, sendFee } = this.context;
    const { publicKey, signPrivateKey, agreementPrivateKey } = this.getKeys();
    const { tokenId, tokenQuantity } = record;
    const { name, decimals } = await ledger.asset.getAsset({
      assetId: tokenId,
    });
    const tokenAmount = ChainValue.create(decimals)
      .setAtomic(tokenQuantity)
      .getCompound();
    const message = `Withdrawal of ${tokenAmount} ${name} was confirmed. You'll receive your money on your banking account soon.`;

    return (await ledger.message.sendEncryptedMessage({
      message,
      messageIsText: true,
      recipientId: Address.fromPublicKey(customerPublicKey).getNumericId(),
      recipientPublicKey: customerPublicKey,
      deadline: 1440,
      feePlanck: sendFee.getPlanck(),
      senderPublicKey: publicKey,
      senderPrivateKey: signPrivateKey,
      senderAgreementKey: agreementPrivateKey,
    })) as TransactionId;
  }
}
