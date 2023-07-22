import { createLedgerClient } from "@/bff/createLedgerClient";
import { getEnvVar } from "@/bff/getEnvVar";
import { ApiHandler } from "@/bff/types/apiHandler";
import { badRequest } from "@hapi/boom";
import { number, object, string, ValidationError, date } from "yup";
import { AssetAliasService } from "@axtp/core";
import { generateMasterKeys } from "@signumjs/crypto";
import { TransactionId } from "@signumjs/core";

const registerAssetBodySchema = object({
  aliasBaseName: string().required(),
  aliasTld: string().required(),
  name: string().required(),
  titleId: string().required(),
  poolId: string().required(),
  acquisitionStatus: number().required().min(0).max(4).integer(),
  acquisitionDate: date().required(),
  accumulatedCosts: number().required().moreThan(0),
  estimatedMarketValue: number().required().moreThan(0),
  acquisitionProgress: number().required().min(0).max(5).integer(),
  nextAlias: string().default(""),
});

export const registerAsset: ApiHandler = async ({ req, res }) => {
  try {
    const { aliasBaseName, aliasTld, ...d } =
      registerAssetBodySchema.validateSync(req.body);

    const ledger = createLedgerClient();
    const assetService = new AssetAliasService({ ledger });
    const accountSeed = getEnvVar(
      "NEXT_SERVER_PRINCIPAL_SIGNUM_ACCOUNT_SECRET"
    );

    const { publicKey, signPrivateKey } = generateMasterKeys(accountSeed);
    const transaction = (await assetService.createAssetAlias({
      aliasBaseName,
      aliasTld,
      data: {
        accumulatedCosts: d.accumulatedCosts,
        acquisitionDate: d.acquisitionDate,
        acquisitionProgress: d.acquisitionProgress,
        acquisitionStatus: d.acquisitionStatus,
        estimatedMarketValue: d.estimatedMarketValue,
        name: d.name,
        nextAlias: d.nextAlias ?? undefined,
        poolId: d.poolId,
        titleId: d.titleId,
      },
      senderPublicKey: publicKey,
      senderPrivateKey: signPrivateKey,
    })) as TransactionId;

    res.status(201).json(transaction);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
