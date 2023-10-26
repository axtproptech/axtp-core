import { HttpClientFactory } from "@signumjs/http";
import retry, { AbortError } from "p-retry";

interface UploadFileArgs {
  signedUploadUrl: string;
  file: File;
  onProgress: (progress: { loaded: number; total: number }) => void;
}

interface DownloadFileArgs {
  objectKey: string;
}

export class ClientSideFileService {
  async uploadFile({
    signedUploadUrl,
    file,
    onProgress,
  }: UploadFileArgs): Promise<void> {
    return retry(async () => {
      const http = HttpClientFactory.createHttpClient(signedUploadUrl);
      const { status } = await http.put("", file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: onProgress,
      });

      if (status >= 400 && status < 500) {
        throw new AbortError("Failed to upload file(s)");
      }
    });
  }

  downloadFile() {
    throw new Error("Implement me!");
  }
}
