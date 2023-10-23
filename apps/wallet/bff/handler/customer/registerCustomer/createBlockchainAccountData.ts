import { getEnvVar } from "@/bff/getEnvVar";
import { Address } from "@signumjs/core";
import { badRequest } from "@hapi/boom";

export function createBlockchainAccountData(publicKey: string) {
  try {
    const isTestnet = getEnvVar("NEXT_PUBLIC_LEDGER_IS_TESTNET") === "true";
    const address = Address.fromPublicKey(publicKey, isTestnet ? "TS" : "S");
    return {
      publicKey,
      accountId: address.getNumericId(),
      rsAddress: address.getReedSolomonAddress(true),
    };
  } catch (e) {
    throw badRequest("Invalid public key");
  }
}
