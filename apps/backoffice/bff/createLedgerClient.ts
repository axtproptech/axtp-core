import { LedgerClientFactory } from "@signumjs/core";
import { getEnvVar } from "./getEnvVar";

export const createLedgerClient = () => {
  return LedgerClientFactory.createClient({
    nodeHost: getEnvVar("NEXT_PUBLIC_SIGNUM_DEFAULT_HOST"),
  });
};
