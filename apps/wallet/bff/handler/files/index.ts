import { RouteHandlerFunction } from "@/bff/route";
import { getEnvVar } from "@/bff/getEnvVar";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import { CreateUploadUrlRequest } from "@/types/createUploadUrlRequest";

import { ServerSideFileService } from "@axtp/core/file";

const TargetBucketName = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
const AccountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
const AccessKeyId = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_KEY_ID"
);
const AccessKeySecret = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_SECRET"
);

export const createUploadURL: RouteHandlerFunction = async (req, res) => {
  const { contentType } = req.body as CreateUploadUrlRequest;

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

    res.status(201).json(signedUrl as CreateUploadUrlResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};
