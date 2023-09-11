import { Http, HttpClientFactory } from "@signumjs/http";
import retry from "p-retry";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";

interface UploadFileArgs {
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

export class FileService {
  constructor(private bffClient: Http) {}

  private async getUploadUrl(contentType: string) {
    return retry(async () => {
      const { response } = await this.bffClient.post("/files", { contentType });
      return response as CreateUploadUrlResponse;
    });
  }

  async uploadFile({ file, onProgress }: UploadFileArgs): Promise<string> {
    const { signedUrl } = await this.getUploadUrl(file.type);
    return retry(async () => {
      const http = HttpClientFactory.createHttpClient(signedUrl);

      const { response, status } = await http.put("", file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: onProgress,
      });

      console.log("uploadFile", response);

      if (status === 200) {
        return response;
      }
    });
  }
}
