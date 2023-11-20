import { Http } from "@signumjs/http";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import retry from "p-retry";

import { ClientSideFileService } from "@axtp/core/file";

interface UploadFileArgs {
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

export class FileService {
  constructor(private bffClient: Http) {}

  private async getUploadUrl(contentType: string) {
    return retry(async () => {
      const { response } = await this.bffClient.post("/files/upload", {
        contentType,
      });
      return response as CreateUploadUrlResponse;
    });
  }

  async uploadFile({
    file,
    onProgress,
  }: UploadFileArgs): Promise<CreateUploadUrlResponse> {
    const uploadUrlResponse = await this.getUploadUrl(file.type);
    const fileService = new ClientSideFileService();
    await fileService.uploadFile({
      signedUploadUrl: uploadUrlResponse.signedUrl,
      file,
      onProgress,
    });
    return uploadUrlResponse;
  }
}
