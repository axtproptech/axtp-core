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

function isEncryptedMessage(tx: Transaction) {
  return isAttachmentVersion(tx, "EncryptedMessage");
}

function tryExtractAmount(tx: Transaction, accountId: string) {
  if (
    tx.sender !== accountId &&
    (isMultiOutSameTransaction(tx) || isMultiOutTransaction(tx))
  ) {
    const multiout = getRecipientAmountsFromMultiOutPayment(tx);
    const found = multiout.find(({ recipient }) => recipient === accountId);
    if (found) {
      return Number(Amount.fromPlanck(found.amountNQT).getSigna());
    }
  }

  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetDistributeToHolders &&
    tx.distribution
  ) {
    return Number(Amount.fromPlanck(tx.distribution.amountNQT || "0"));
  }

  return Number(Amount.fromPlanck(tx.amountNQT).getSigna());
}

function tryExtractTokenAmounts(tx: Transaction, tokens: TokenMetaData[]) {
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
          amount: Number(
            ChainValue.create(tokenMetaData.decimals)
              .setAtomic(tx.attachment.quantityQNT)
              .getCompound()
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
    direction: getDirectionType(tx, accountId),
    signa: tryExtractAmount(tx, accountId),
    feeSigna: Number(Amount.fromPlanck(tx.feeNQT).getSigna()),
    tokens: tryExtractTokenAmounts(tx, relevantTokens),
    message: tryExtractmessage(tx),
    hasEncryptedMessage: isEncryptedMessage(tx),
  };
};
