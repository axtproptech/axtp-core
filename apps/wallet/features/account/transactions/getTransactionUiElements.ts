import {
  TransactionArbitrarySubtype,
  TransactionAssetSubtype,
  TransactionEscrowSubtype,
  TransactionMiningSubtype,
  TransactionPaymentSubtype,
  TransactionSmartContractSubtype,
  TransactionType,
} from "@signumjs/core";
import { TransactionData } from "@/types/transactionData";
import {
  FcBullish,
  FcBearish,
  FcAbout,
  FcDocument,
  FcQuestions,
  FcAddDatabase,
  FcDeleteDatabase,
  FcCollaboration,
  FcCancel,
  FcOvertime,
  FcDiploma1,
  FcDiploma2,
  FcElectronics,
  FcSafe,
  FcCurrencyExchange,
  FcCandleSticks,
} from "react-icons/fc";

const TransactionTypeMap: any = {
  [TransactionType.Mining]: {
    [TransactionMiningSubtype.AddCommitment]: {
      i18n: "typeAddCommitment",
      icon: FcAddDatabase,
    },
    [TransactionMiningSubtype.RemoveCommitment]: {
      i18n: "typeRemoveCommitment",
      icon: FcDeleteDatabase,
    },
    [TransactionMiningSubtype.RewardRecipientAssignment]: {
      i18n: "typeRewardRecipientAssignment",
      icon: FcCollaboration,
    },
  },
  [TransactionType.Escrow]: {
    [TransactionEscrowSubtype.SubscriptionCancel]: {
      i18n: "typeSubscriptionCancel",
      icon: FcCancel,
    },
    [TransactionEscrowSubtype.SubscriptionSubscribe]: {
      i18n: "typeSubscriptionSubscribe",
      icon: FcOvertime,
    },
    [TransactionEscrowSubtype.SubscriptionPayment]: {
      i18n: "typeSubscriptionPayment",
      icon: FcBullish,
      iconOut: FcBearish,
    },
  },
  [TransactionType.Payment]: {
    [TransactionPaymentSubtype.Ordinary]: {
      i18n: "typeSinglePayment",
      icon: FcBullish,
      iconOut: FcBearish,
    },
    [TransactionPaymentSubtype.MultiOut]: {
      i18n: "typeMultiOutPayment",
      icon: FcBullish,
      iconOut: FcBearish,
    },
    [TransactionPaymentSubtype.MultiOutSameAmount]: {
      i18n: "typeMultiOutSamePayment",
      icon: FcBullish,
      iconOut: FcBearish,
    },
  },
  [TransactionType.Arbitrary]: {
    [TransactionArbitrarySubtype.AccountInfo]: {
      i18n: "typeAccountInfoUpdate",
      icon: FcAbout,
    },
    [TransactionArbitrarySubtype.Message]: {
      i18n: "typeMessage",
      icon: FcDocument,
    },
    [TransactionArbitrarySubtype.AliasAssignment]: {
      i18n: "typeAliasUpdate",
      icon: FcDiploma1,
    },
    [TransactionArbitrarySubtype.TopLevelDomainAssignment]: {
      i18n: "typeAliasTLD",
      icon: FcDiploma2,
    },
    [TransactionArbitrarySubtype.AliasBuy]: {
      i18n: "typeAliasBuy",
      icon: FcDiploma1,
    },
    [TransactionArbitrarySubtype.AliasSale]: {
      i18n: "typeAliasSale",
      icon: FcDiploma1,
    },
  },
  [TransactionType.AT]: {
    [TransactionSmartContractSubtype.SmartContractPayment]: {
      i18n: "typeContractPayment",
      icon: FcBullish,
    },
    [TransactionSmartContractSubtype.SmartContractCreation]: {
      i18n: "typeContractCreation",
      icon: FcElectronics,
    },
  },
  [TransactionType.Asset]: {
    [TransactionAssetSubtype.AssetTransfer]: {
      i18n: "typeTokenTransfer",
      icon: FcBullish,
      iconOut: FcBearish,
    },
    [TransactionAssetSubtype.AssetAddTreasureyAccount]: {
      i18n: "typeTokenAddTreasuryAccount",
      icon: FcSafe,
    },
    [TransactionAssetSubtype.AssetIssuance]: {
      i18n: "typeTokenIssuance",
      icon: FcCurrencyExchange,
    },
    [TransactionAssetSubtype.AssetMint]: {
      i18n: "typeTokenMint",
      icon: FcCurrencyExchange,
    },
    [TransactionAssetSubtype.AssetDistributeToHolders]: {
      i18n: "typeTokenHolderDistribution",
      icon: FcBullish,
      iconOut: FcBearish,
    },
    [TransactionAssetSubtype.AssetMultiTransfer]: {
      i18n: "typeTokenMultiTransfer",
      icon: FcBullish,
      iconOut: FcBearish,
    },
    [TransactionAssetSubtype.AskOrderPlacement]: {
      i18n: "typeTokenAskOrderPlacement",
      icon: FcCandleSticks,
    },
    [TransactionAssetSubtype.AskOrderCancellation]: {
      i18n: "typeTokenAskOrderCancellation",
      icon: FcCancel,
    },
    [TransactionAssetSubtype.BidOrderPlacement]: {
      i18n: "typeTokenBidOrderPlacement",
      icon: FcCandleSticks,
    },
    [TransactionAssetSubtype.BidOrderCancellation]: {
      i18n: "typeTokenBidOrderCancellation",
      icon: FcCancel,
    },
    [TransactionAssetSubtype.AssetTransferOwnership]: {
      i18n: "typeTokenTransferOwnership",
      icon: FcCurrencyExchange,
    },
  },
};

function getTransactionTypeTranslationKey(tx: TransactionData) {
  let result = {
    i18n: "typeUnknown",
    icon: FcQuestions,
    iconOut: undefined,
  };
  if (TransactionTypeMap[tx.type] && TransactionTypeMap[tx.type][tx.subtype]) {
    result = TransactionTypeMap[tx.type][tx.subtype];
  }
  return result;
}

export function getTransactionUiElements(tx: TransactionData) {
  const info = getTransactionTypeTranslationKey(tx);
  return {
    typeName: info.i18n,
    icon: tx.direction !== "in" && info.iconOut ? info.iconOut : info.icon,
    ...tx,
  };
}
