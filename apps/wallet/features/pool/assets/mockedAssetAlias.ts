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
        "x-st": 0,
        "x-ad": 1687970811678,
        "x-ac": 14095.23,
        "x-mv": 46890.0,
        "x-pr": 0,
      })
    ),
  ],
  [
    "2",
    AssetAlias.parse(
      JSON.stringify({
        vs: 1,
        nm: "002 a name",
        id: "title-deed-id 2",
        "x-pid": "10177744785315162361",
        "x-st": 0,
        "x-ad": 1687970811678,
        "x-ac": 5839.23,
        "x-mv": 50000,
        "x-pr": 1,
      })
    ),
  ],
  [
    "3",
    AssetAlias.parse(
      JSON.stringify({
        vs: 1,
        nm: "003 some longer name ",
        id: "title-deed-id 3",
        "x-pid": "10177744785315162361",
        "x-st": 2,
        "x-ad": 1687970811678,
        "x-ac": 6267,
        "x-mv": 50000,
        "x-pr": 3,
      })
    ),
  ],
  [
    "4",
    AssetAlias.parse(
      JSON.stringify({
        vs: 1,
        nm: "004 Mississippi ",
        id: "title-deed-id 3",
        "x-pid": "10177744785315162361",
        "x-st": 1,
        "x-ad": 1687970811678,
        "x-ac": 4125,
        "x-mv": 25750,
        "x-pr": 3,
      })
    ),
  ],
]);
