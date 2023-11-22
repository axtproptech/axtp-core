import { Http, HttpClientFactory } from "@signumjs/http";

import { ClientSideFileService, SignedUrl } from "@axtp/core/file";

interface UploadFileArgs {
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

export class FileService {
  private readonly bffClient: Http;

  constructor() {
    this.bffClient = HttpClientFactory.createHttpClient("/api/admin/files");
  }

  private async getUploadUrl(contentType: string) {
    const { response } = await this.bffClient.post("/upload", {
      contentType,
    });
    return response as SignedUrl;
  }

  async uploadFile({ file, onProgress }: UploadFileArgs): Promise<SignedUrl> {
    const uploadUrlResponse = await this.getUploadUrl(file.type);
    const fileService = new ClientSideFileService();
    await fileService.uploadFile({
      signedUploadUrl: uploadUrlResponse.signedUrl,
      file,
      onProgress,
    });
    return uploadUrlResponse;
  }

  async getDownloadUrl(objectId: string) {
    const { response } = await this.bffClient.post("/download", {
      objectId,
    });
    return response as SignedUrl;
  }
}

export const fileService = new FileService();
