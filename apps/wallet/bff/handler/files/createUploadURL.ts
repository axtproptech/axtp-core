import { RouteHandlerFunction } from "@/bff/route";
import aws from "aws-sdk";
import { getEnvVar } from "@/bff/getEnvVar";
import { nanoid } from "nanoid";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import { CreateUploadUrlRequest } from "@/types/createUploadUrlRequest";

const TargetBucketName = getEnvVar("NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET");
const AccountId = getEnvVar("NEXT_SERVER_CF_R2_ACCOUNT_ID");
const AccessKeyId = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_KEY_ID"
);
const AccessKeySecret = getEnvVar(
  "NEXT_SERVER_CF_R2_AXTP_KYC_BUCKET_ACCESS_SECRET"
);

console.log(TargetBucketName, AccessKeyId, AccessKeySecret);

// CF is AWS compatible
const r2 = new aws.S3({
  endpoint: `https://${AccountId}.r2.cloudflarestorage.com`,
  accessKeyId: `${AccessKeyId}`,
  secretAccessKey: `${AccessKeySecret}`,
  signatureVersion: "v4",
});

export const createUploadURL: RouteHandlerFunction = async (req, res) => {
  const { contentType } = req.body as CreateUploadUrlRequest;

  try {
    const params = {
      Bucket: TargetBucketName,
      Key: nanoid(),
      Expires: 5 * 60,
      ContentType: contentType,
    };

    const signedUrl = await r2.getSignedUrlPromise("putObject", params);
    const objectUrl = `https://${AccountId}.r2.cloudflarestorage.com/${params.Bucket}/${params.Key}`;

    res.status(201).json({
      signedUrl,
      objectUrl,
    } as CreateUploadUrlResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};
