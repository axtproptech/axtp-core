import { RouteHandlerFunction } from "@/bff/route";
import { getEnvVar } from "@/bff/getEnvVar";
import { ServerSideFileService } from "@axtp/core/file";
import { CreateUploadUrlRequest } from "@/types/createUploadUrlRequest";
import { CreateDownloadUrlRequest } from "@/types/createDownloadUrlRequest";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import { CreateDownloadUrlResponse } from "@/types/createDownloadUrlResponse";

const TargetBucketName = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
const AccountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
const AccessKeyId = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_KEY_ID"
);
const AccessKeySecret = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_SECRET"
);

const BucketName = {
  kyc: getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET"),
  "signed-document": getEnvVar("NEXT_SERVER_CF_R2_AXTP_SIGNED_DOCS_BUCKET"),
};

export const createUploadURL: RouteHandlerFunction = async (req, res) => {
  const { contentType, documentCategory } = req.body as CreateUploadUrlRequest;

  try {
    const fileService = new ServerSideFileService({
      accessKeyId: AccessKeyId,
      accountId: AccountId,
      accessKeySecret: AccessKeySecret,
      targetBucketName: BucketName[documentCategory],
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

export const createDownloadURL: RouteHandlerFunction = async (req, res) => {
  const { objectId } = req.body as CreateDownloadUrlRequest;

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

    res.status(201).json(signedUrl as CreateDownloadUrlResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};
