import { Http, HttpClientFactory } from "@signumjs/http";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import retry from "p-retry";

interface UploadFileArgs {
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

interface DeleteFileArgs {
  objectKey: string;
}

export class FileService {
  constructor(private bffClient: Http) {}

  private async getUploadUrl(contentType: string) {
    return retry(async () => {
      const { response } = await this.bffClient.post("/files", { contentType });
      return response as CreateUploadUrlResponse;
    });
  }

  async uploadFile({
    file,
    onProgress,
  }: UploadFileArgs): Promise<CreateUploadUrlResponse> {
    const { signedUrl, objectUrl, objectName } = await this.getUploadUrl(
      file.type
    );

    return retry(async () => {
      const http = HttpClientFactory.createHttpClient(signedUrl);

      const { status } = await http.put("", file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: onProgress,
      });

      if (status === 200) {
        return { signedUrl, objectUrl, objectName };
      }

      return { signedUrl: "", objectUrl: "", objectName: "" };
    });
  }
}
