import localforage from "localforage";

localforage.config({
  name: "axtp_storage",
  version: 1,
  storeName: "AXTP",
});

export const storage = localforage;
