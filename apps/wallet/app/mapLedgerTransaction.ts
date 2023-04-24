import {
  getRecipientAmountsFromMultiOutPayment,
  isAttachmentVersion,
  isMultiOutSameTransaction,
  isMultiOutTransaction,
  Transaction,
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionEscrowSubtype,
  TransactionMiningSubtype,
  TransactionPaymentSubtype,
  TransactionSmartContractSubtype,
  TransactionType,
} from "@signumjs/core";
import { TransactionData } from "@/types/transactionData";
import { ChainTime, Amount, ChainValue } from "@signumjs/util";
import { Config } from "@/app/config";
import { TokenMetaData } from "@/types/tokenMetaData";
import { toQuantity, toStableCoinAmount } from "@/app/tokenQuantity";

type Direction = "out" | "in" | "burn" | "self";

function d(n: number, dir: Direction): number {
  return dir === "in" ? n : -n;
}

interface MappingContext {
  accountId: string;
  relevantTokens: TokenMetaData[];
}

function tryExtractmessage(tx: Transaction) {
  if (isAttachmentVersion(tx, "Message")) {
    return tx.attachment.messageIsText ? tx.attachment.message : "";
  }
  return "";
}

function tryExtractEncryptedMessage(tx: Transaction) {
  const isEncrypted = isAttachmentVersion(tx, "EncryptedMessage");
  if (!isEncrypted) return null;
  return tx.attachment.encryptedMessage;
}

function isEncryptedMessage(tx: Transaction) {
  return isAttachmentVersion(tx, "EncryptedMessage");
}

function tryExtractAmount(
  tx: Transaction,
  accountId: string,
  direction: Direction
) {
  if (
    tx.sender !== accountId &&
    (isMultiOutSameTransaction(tx) || isMultiOutTransaction(tx))
  ) {
    const multiout = getRecipientAmountsFromMultiOutPayment(tx);
    const found = multiout.find(({ recipient }) => recipient === accountId);
    if (found) {
      return d(
        Number(Amount.fromPlanck(found.amountNQT).getSigna()),
        direction
      );
    }
  }

  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetDistributeToHolders &&
    tx.distribution
  ) {
    return d(
      Number(Amount.fromPlanck(tx.distribution.amountNQT || "0")),
      direction
    );
  }

  return d(Number(Amount.fromPlanck(tx.amountNQT).getSigna()), direction);
}

function tryExtractTokenAmounts(
  tx: Transaction,
  tokens: TokenMetaData[],
  direction: Direction
) {
  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetTransfer
  ) {
    const transferredAsset = tx.attachment.asset;
    const tokenMetaData = tokens.find((t) => t.id === transferredAsset);
    if (tokenMetaData) {
      return [
        {
          name: tokenMetaData.name,
          amount: d(
            Number(
              ChainValue.create(tokenMetaData.decimals)
                .setAtomic(tx.attachment.quantityQNT)
                .getCompound()
            ),
            direction
          ),
        },
      ];
    }
  }

  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetDistributeToHolders &&
    tx.distribution
  ) {
    const transferredAsset = tx.distribution.distributedAssetId;
    const tokenMetaData = tokens.find((t) => t.id === transferredAsset);
    if (tokenMetaData) {
      return [
        {
          name: tokenMetaData.name,
          amount: Number(
            ChainValue.create(tokenMetaData.decimals)
              .setAtomic(tx.distribution.quantityQNT)
              .getCompound()
          ),
        },
      ];
    }
  }

  // TODO: multiasset transfer

  return [];
}

function getDirectionType(
  tx: Transaction,
  accountId: string
): "out" | "in" | "burn" | "self" {
  if (tx.recipient === "0") {
    return "burn";
  }

  if (!tx.recipient || tx.recipient === tx.sender) {
    return "self";
  }

  if (tx.recipient === accountId) {
    return "in";
  }

  return "out";
}

export const mapLedgerTransaction = (
  tx: Transaction,
  context: MappingContext
): TransactionData => {
  const { accountId, relevantTokens } = context;
  const direction = getDirectionType(tx, accountId);
  return {
    id: tx.transaction,
    timestamp: tx.timestamp,
    type: tx.type,
    subtype: tx.subtype,
    dateTime: ChainTime.fromChainTimestamp(tx.timestamp)
      .getDate()
      .toISOString(),
    receiver: tx.recipient || "",
    receiverAddress: tx.recipientRS || "",
    sender: tx.sender,
    senderAddress: tx.senderRS,
    explorerUrl: `${Config.Ledger.ExplorerUrl}/tx/${tx.transaction}`,
    isPending: tx.confirmations === undefined,
    direction,
    signa: tryExtractAmount(tx, accountId, direction),
    feeSigna: Number(Amount.fromPlanck(tx.feeNQT).getSigna()),
    tokens: tryExtractTokenAmounts(tx, relevantTokens, direction),
    message: tryExtractmessage(tx),
    encryptedMessage: tryExtractEncryptedMessage(tx),
  };
};
