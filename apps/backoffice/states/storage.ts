import localforage from "localforage";

localforage.config({
  name: "signum_swap_storage",
  version: 1,
  storeName: "signum_swap",
});

export const storage = localforage;
