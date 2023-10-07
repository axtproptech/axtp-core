import { useTranslation } from "next-i18next";
import { useMemo, useState, useRef } from "react";
import { RiArrowUpCircleLine } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";
import { useNotification } from "@/app/hooks/useNotification";
import { CreateUploadUrlResponse } from "@/types/createUploadUrlResponse";
import { FileChip } from "./components/fileChip";

type Progress = { loaded: number; total: number };

type FileTypes = "image/*" | "application/pdf";

interface Props {
  fileTypes?: FileTypes[];
  onUploadSuccess: (value: string) => void;
}

const MAX_FILES = 1;

export function FileUploader({ onUploadSuccess, fileTypes = [] }: Props) {
  const { t } = useTranslation();
  const { FileService } = useAppContext();
  const { showSuccess, showError, showInfo } = useNotification();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, Progress>
  >({});

  const dynamicFileInputArgs = useMemo(() => {
    let args: any = {};

    if (fileTypes.length > 0) {
      args["accept"] = fileTypes.join(",");
    }

    return args;
  }, [fileTypes]);

  const handleFileInputChange = (event: any) => {
    if (event.target.files.length > MAX_FILES) {
      return showError(t("too_many_files", { count: MAX_FILES }));
    }

    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      return;
    }

    try {
      setIsUploading(true);

      const uploadRequests: Promise<CreateUploadUrlResponse>[] = [];

      for (let file of selectedFiles) {
        uploadRequests.push(
          FileService.uploadFile({
            file,
            onProgress: (progress) => {
              setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
            },
          })
        );
      }

      const results = await Promise.allSettled(uploadRequests);
      const failedUploads = results.some((r) => r.status === "rejected");

      if (failedUploads) throw new Error("File Upload Failure");

      if (results[0]) {
        // @ts-ignore
        const objectName = results[0]?.value?.objectName;
        setUploadedFile(objectName);
        onUploadSuccess(objectName);
      }

      showSuccess(t("file_upload_success"));
    } catch (error) {
      showError(t("file_upload_failure"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    const objectKey = uploadedFile;

    const response = await FileService.deleteFile({ objectKey });
    if (response.deleted && inputRef.current) {
      showInfo(t("file_deletion_success"));
      onUploadSuccess("");
      setUploadProgress({});
      setUploadedFile("");
      setSelectedFiles(null);
      inputRef.current.value = "";
    }
  };

  const progresses = useMemo(() => {
    return Object.entries(uploadProgress).map(([file, progress]) => ({
      file,
      loaded: progress.loaded,
      total: progress.total,
    }));
  }, [uploadProgress]);

  const canSubmitFile = useMemo(() => {
    return (
      !isUploading &&
      selectedFiles &&
      Object.entries(uploadProgress).length < MAX_FILES
    );
  }, [isUploading, selectedFiles, uploadProgress]);

  return (
    <div className="flex flex-col w-full pb-0">
      <div className="flex flex-col items-center justify-center gap-2">
        <input
          ref={inputRef}
          type="file"
          className="file-input w-full"
          onChange={handleFileInputChange}
          {...dynamicFileInputArgs}
        />

        <button
          type="button"
          className="w-full btn btn-square flex flex-row items-center gap-1 font-bold"
          onClick={handleUpload}
          disabled={!canSubmitFile}
        >
          <RiArrowUpCircleLine size={24} />

          {isUploading && `${t("uploading")}...`}
          {!isUploading && `${t("upload_file")}`}
        </button>
      </div>

      {!!progresses.length && (
        <>
          <div className="divider" />

          <div className="flex flex-col w-full">
            {progresses.map(({ file, loaded, total }) => (
              <FileChip
                key={file}
                file={file}
                loaded={loaded}
                total={total}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
