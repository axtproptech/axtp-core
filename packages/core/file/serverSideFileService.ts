import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client as R2Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

export interface ServerSideFileServiceContext {
  accountId: string;
  accessKeyId: string;
  accessKeySecret: string;
  targetBucketName: string;
}

/**
 * Server Side File Service
 *
 * Mainly responsible to fetch *secure* signed Urls for upload/download to Cloudflare
 *
 * @note Must not used on client side!
 */
export class ServerSideFileService {
  private readonly cloudflareR2: R2Client;

  constructor(private context: ServerSideFileServiceContext) {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called on the server");
    }
    this.cloudflareR2 = new R2Client({
      endpoint: `https://${context.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: `${context.accessKeyId}`,
        secretAccessKey: `${context.accessKeySecret}`,
      },
      region: "auto",
    });
  }

  get accountId() {
    return this.context.accountId;
  }

  get bucketName() {
    return this.context.targetBucketName;
  }

  /**
   * Requests a signed Url from Cloudflare R2 to upload a file
   *
   * The returning Url requires to use HTTP PUT for upload
   *
   * @param contentType A valid mime type
   * @param expirySeconds Url validity duration in seconds
   */
  async fetchSignedUploadUrl(contentType: string, expirySeconds = 5 * 60) {
    const params = {
      Bucket: this.bucketName,
      Key: nanoid(),
      Expires: new Date(Date.now() + expirySeconds * 1000),
      ContentType: contentType,
    };

    const signedUrl = await getSignedUrl(
      this.cloudflareR2,
      new PutObjectCommand(params)
    );
    const objectUrl = `https://${this.accountId}.r2.cloudflarestorage.com/${params.Bucket}/${params.Key}`;
    const objectName = params.Key;

    return {
      signedUrl,
      objectUrl,
      objectName,
    };
  }
  /**
   * Fetches a signed download URL for an object.
   *
   * @param {string} objectId - The ID of the object.
   * @param {number} [expirySeconds=300] - The number of seconds until the signed URL expires.
   * @return {Promise<Object>} An object containing the signed URL, object URL, and object name.
   */
  async fetchSignedDownloadUrl(objectId: string, expirySeconds = 5 * 60) {
    const params = {
      Bucket: this.bucketName,
      Key: objectId,
      Expires: new Date(Date.now() + expirySeconds * 1000),
    };

    const signedUrl = await getSignedUrl(
      this.cloudflareR2,
      new GetObjectCommand(params)
    );
    const objectUrl = `https://${this.accountId}.r2.cloudflarestorage.com/${params.Bucket}/${params.Key}`;
    const objectName = params.Key;

    return {
      signedUrl,
      objectUrl,
      objectName,
    };
  }
}
