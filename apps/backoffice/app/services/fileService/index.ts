import { Http, HttpClientFactory } from "@signumjs/http";

import { R2ObjectUri, ClientSideFileService, SignedUrl } from "@axtp/core/file";

interface UploadFileArgs {
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

export class FileService {
  private readonly bffClient: Http;

  constructor() {
    this.bffClient = HttpClientFactory.createHttpClient("/api/admin/files");
  }

  private getR2UriFromObjectUrl(objectUrl: string) {
    const URLParser =
      /https:\/\/(?<accountId>.+)\.r2\.cloudflarestorage\.com\/(?<bucket>.+)\/(?<objectId>.+)/;
    const match = URLParser.exec(objectUrl);
    if (!match?.groups) {
      throw new Error("Got Invalid URL");
    }

    const { accountId, bucket, objectId } = match.groups;
    return new R2ObjectUri({
      accountId,
      bucket,
      objectId,
    });
  }

  private async getUploadUrl(contentType: string) {
    const { response } = await this.bffClient.post("/upload", {
      contentType,
    });
    return response as SignedUrl;
  }

  async uploadFile({ file, onProgress }: UploadFileArgs): Promise<R2ObjectUri> {
    const uploadUrlResponse = await this.getUploadUrl(file.type);
    const fileService = new ClientSideFileService();
    await fileService.uploadFile({
      signedUploadUrl: uploadUrlResponse.signedUrl,
      file,
      onProgress,
    });
    return this.getR2UriFromObjectUrl(uploadUrlResponse.objectUrl);
  }

  async getDownloadUrl(objectId: string) {
    const { response } = await this.bffClient.post("/download", {
      objectId,
    });
    return response as SignedUrl;
  }
}

export const fileService = new FileService();
