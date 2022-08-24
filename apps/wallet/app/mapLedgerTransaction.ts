import {
  getRecipientAmountsFromMultiOutPayment,
  isAttachmentVersion,
  isMultiOutSameTransaction,
  isMultiOutTransaction,
  Transaction,
  TransactionAssetSubtype,
  TransactionType,
} from "@signumjs/core";
import { TransactionData } from "@/types/transactionData";
import { ChainTime, Amount } from "@signumjs/util";
import { Config } from "@/app/config";
import { TokenMetaData } from "@/types/tokenMetaData";
import { toQuantity, toStableCoinAmount } from "@/app/tokenQuantity";

interface MappingContext {
  accountId: string;
  axtToken: TokenMetaData;
  poolTokens: TokenMetaData[];
}

function tryExtractmessage(tx: Transaction) {
  if (isAttachmentVersion(tx, "message")) {
    return tx.attachment.messageIsText ? tx.attachment.message : "";
  }
  return "";
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

  return Number(Amount.fromPlanck(tx.amountNQT).getSigna());
}

function tryExtractAxtAmount(tx: Transaction, axtToken: TokenMetaData) {
  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetTransfer
  ) {
    const transferredAsset = tx.attachment.asset;
    if (transferredAsset === axtToken.id) {
      return Number(toStableCoinAmount(tx.attachment.quantityQNT));
    }
  }
  return undefined;
}

function tryExtractPoolToken(tx: Transaction, poolTokens: TokenMetaData[]) {
  if (
    tx.type === TransactionType.Asset &&
    tx.subtype === TransactionAssetSubtype.AssetTransfer
  ) {
    const poolToken = poolTokens.find(({ id }) => id === tx.attachment.asset);
    if (poolToken) {
      return {
        ...poolToken,
        quantity: toQuantity(tx.attachment.quantityQNT, poolToken.decimals),
      };
    }
  }

  return undefined;
}

export const mapLedgerTransaction = (
  tx: Transaction,
  context: MappingContext
): TransactionData => {
  const { accountId, axtToken, poolTokens } = context;
  return {
    id: tx.transaction,
    dateTime: ChainTime.fromChainTimestamp(tx.timestamp)
      .getDate()
      .toISOString(),
    receiver: tx.recipient || "",
    sender: tx.sender,
    explorerUrl: `${Config.Ledger.ExplorerUrl}/tx/${tx.transaction}`,
    isPending: !tx.confirmations,
    type: accountId === tx.sender ? "out" : "in",
    signa: tryExtractAmount(tx, accountId),
    message: tryExtractmessage(tx),
    axt: tryExtractAxtAmount(tx, axtToken),
    poolToken: tryExtractPoolToken(tx, poolTokens),
  };
};
