import { getEnvVar } from "@/bff/getEnvVar";
import { ServerSideFileService } from "@axtp/core/file/serverSideFileService";
import { ApiHandler } from "@/bff/types/apiHandler";

const TargetBucketName = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
const AccountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
const AccessKeyId = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_KEY_ID"
);
const AccessKeySecret = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_SECRET"
);

import { object, string, ValidationError } from "yup";
import { badRequest } from "@hapi/boom";

let uploadFileSchema = object({ contentType: string().required() });
let downloadFileSchema = object({ objectId: string().required() });

export const createUploadURL: ApiHandler = async ({ req, res }) => {
  const { contentType } = uploadFileSchema.validateSync(req.body);

  try {
    const fileService = new ServerSideFileService({
      accessKeyId: AccessKeyId,
      accountId: AccountId,
      accessKeySecret: AccessKeySecret,
      targetBucketName: TargetBucketName,
    });

    const signedUrl = await fileService.fetchSignedUploadUrl(
      contentType,
      5 * 60
    );

    res.status(201).json(signedUrl);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};

export const createDownloadURL: ApiHandler = async ({ req, res }) => {
  const { objectId } = downloadFileSchema.validateSync(req.body);

  try {
    const fileService = new ServerSideFileService({
      accessKeyId: AccessKeyId,
      accountId: AccountId,
      accessKeySecret: AccessKeySecret,
      targetBucketName: TargetBucketName,
    });

    const signedUrl = await fileService.fetchSignedDownloadUrl(
      objectId,
      5 * 60
    );

    res.status(201).json(signedUrl);
  } catch (e: any) {
    if (e instanceof ValidationError) {
      throw badRequest(e.errors.join(","));
    }
    throw e;
  }
};
