import { AssetAlias, type AssetAliasHistory } from "@axtp/core";

export const mockedAssetAliasHistory: AssetAliasHistory = [
  {
    transactionId: "13442847954798353477",
    timestamp: 282416784,
    assetData: AssetAlias.parse(
      '{"vs":1,"nm":"001","id":"test-id","x-pid":"17794542874900784390","x-st":"1","x-ad":"1690138190439","x-ac":"7500","x-mv":"45000","x-pr":"2"}'
    ).getData(),
  },
  {
    transactionId: "9762103392368708445",
    timestamp: 282416303,
    assetData: AssetAlias.parse(
      '{"vs":1,"nm":"001","id":"test-id","x-pid":"17794542874900784390","x-st":"0","x-ad":"1690138190439","x-ac":"7500","x-mv":"45000","x-pr":"0"}'
    ).getData(),
  },
  {
    transactionId: "6110288486559604905",
    timestamp: 282415807,
    assetData: AssetAlias.parse(
      '{"vs":1,"nm":"001","id":"test-id","x-pid":"17794542874900784390","x-st":"0","x-ad":"1690138190439","x-ac":"5000","x-mv":"35000","x-pr":"0"}'
    ).getData(),
  },
];
