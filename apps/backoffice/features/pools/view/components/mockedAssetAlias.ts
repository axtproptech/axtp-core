import { AssetAlias, AssetAliasMap } from "@axtp/core/aliases";

export const mockedAssetAlias: AssetAliasMap = new Map<string, AssetAlias>([
  [
    "1",
    AssetAlias.parse(
      JSON.stringify({
        vs: 1,
        nm: "001",
        id: "title-deed-id-1",
        "x-pid": "10177744785315162361",
        "x-as": 0,
        "x-ad": 1687970811678,
        "x-ac": 140595.23,
        "x-mv": 476890.0,
        "x-pr": 0,
        al: "axtp0001_v8avqkn7az60",
      })
    ),
  ],
  [
    "2",
    AssetAlias.parse(
      JSON.stringify({
        vs: 1,
        nm: "002",
        id: "title-deed-id 2",
        "x-pid": "10177744785315162361",
        "x-as": 0,
        "x-ad": 1687970811678,
        "x-ac": 5839.23,
        "x-mv": 500000,
        "x-pr": 1,
        al: "axtp0001_abcde54645",
      })
    ),
  ],
]);
