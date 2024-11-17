import { Http } from "@signumjs/http";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import retry from "p-retry";

import { ClientSideFileService } from "@axtp/core/file";

type UploadDocumentCategory = "kyc" | "signed-document";

interface UploadFileArgs {
  file: File;
  documentCategory: UploadDocumentCategory;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

export class FileService {
  constructor(private bffClient: Http) {}

  private async getUploadUrl(
    contentType: string,
    documentCategory: UploadDocumentCategory
  ) {
    return retry(async () => {
      const { response } = await this.bffClient.post("/files/upload", {
        contentType,
        documentCategory,
      });
      return response as CreateUploadUrlResponse;
    });
  }

  async uploadFile({
    file,
    documentCategory,
    onProgress,
  }: UploadFileArgs): Promise<CreateUploadUrlResponse> {
    const uploadUrlResponse = await this.getUploadUrl(
      file.type,
      documentCategory
    );
    const fileService = new ClientSideFileService();
    await fileService.uploadFile({
      signedUploadUrl: uploadUrlResponse.signedUrl,
      file,
      onProgress,
    });
    return uploadUrlResponse;
  }
}
