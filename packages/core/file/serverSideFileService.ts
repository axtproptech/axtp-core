import aws from "aws-sdk";
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
  private cloudflareR2: aws.S3;

  constructor(private context: ServerSideFileServiceContext) {
    if (typeof window !== "undefined") {
      throw new Error("This function must be called on the server");
    }

    this.cloudflareR2 = new aws.S3({
      endpoint: `https://${context.accountId}.r2.cloudflarestorage.com`,
      accessKeyId: `${context.accessKeyId}`,
      secretAccessKey: `${context.accessKeySecret}`,
      signatureVersion: "v4",
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
      Expires: expirySeconds,
      ContentType: contentType,
    };

    const signedUrl = await this.cloudflareR2.getSignedUrlPromise(
      "putObject",
      params
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
