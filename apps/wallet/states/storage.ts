import localforage from "localforage";

localforage.config({
  name: "fixcoin_eco_storage",
  version: 1,
  storeName: "fixcoin",
});

export const storage = localforage;
