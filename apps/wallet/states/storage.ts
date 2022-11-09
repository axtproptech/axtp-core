import localforage from "localforage";

localforage.config({
  name: "axtp_wallet",
  version: 1,
  storeName: "AXTP",
});

export const storage = localforage;
