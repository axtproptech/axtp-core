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
    const objectName = params.Key;

    res.status(201).json({
      signedUrl,
      objectUrl,
      objectName,
    } as CreateUploadUrlResponse);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// TODO: Discuss about security improvements for not allowing users delete someone'elses KYC files
export const deleteFile: RouteHandlerFunction = async (req, res) => {
  const { query } = req;

  try {
    const params = {
      Bucket: TargetBucketName,
      Key: `${query.objectKey}`,
    };

    await r2
      .deleteObject(params, (err) => {
        if (err) throw err;
      })
      .promise();

    return res.status(200).json({ deleted: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};
