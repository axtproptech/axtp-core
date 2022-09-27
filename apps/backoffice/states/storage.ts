import localforage from "localforage";

localforage.config({
  name: "axtp_backoffice_storage",
  version: 1,
  storeName: "axtp_backoffice",
});

export const storage = localforage;
