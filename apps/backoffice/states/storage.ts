import localforage from "localforage";

localforage.config({
  name: "rest_backoffice_storage",
  version: 1,
  storeName: "rest_backoffice",
});

export const storage = localforage;
