import { Address } from "@signumjs/core";
import { Config } from "@/app/config";

export const asRSAddress = (numericId: string) =>
  numericId
    ? Address.fromNumericId(numericId, Config.Signum.AddressPrefix)
    : "";
