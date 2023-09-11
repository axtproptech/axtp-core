import React, { useMemo, useState } from "react";
import { RiArrowUpCircleLine } from "react-icons/ri";
import { useAppContext } from "@/app/hooks/useAppContext";

type Progress = { loaded: number; total: number };

interface Props {
  maxFiles?: number;
  fileTypes?: string[];
}

export function FileUploader({ maxFiles = 1, fileTypes = [] }: Props) {
  const { FileService } = useAppContext();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, Progress>
  >({});

  const dynamicFileInputArgs = useMemo(() => {
    let args: any = {};
    if (maxFiles > 1) {
      args["multiple"] = true;
    }
    if (fileTypes.length > 0) {
      args["accept"] = fileTypes.join(",");
    }

    return args;
  }, [maxFiles, fileTypes]);

  const handleFileInputChange = (event: any) => {
    if (event.target.files.length > maxFiles) {
      // TODO: show error
      console.error("Too many files");
      return;
    }
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) {
      return;
    }

    const uploadRequests: Promise<string>[] = [];
    for (let file of selectedFiles) {
      uploadRequests.push(
        FileService.uploadFile({
          file,
          onProgress: (progress) => {
            setUploadProgress({ ...uploadProgress, [file.name]: progress });
          },
        })
      );
    }
    const results = await Promise.allSettled(uploadRequests);
    const failedUploads = results.some((r) => r.status === "rejected");
    if (failedUploads) {
      // TODO: show error
      console.error("Some files failed to upload");
      return;
    }
  };

  const progresses = useMemo(() => {
    return Object.entries(uploadProgress).map(([file, progress]) => ({
      file,
      loaded: progress.loaded,
      total: progress.total,
    }));
  }, [uploadProgress]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center">
        <input
          type="file"
          className="file-input w-full"
          onChange={handleFileInputChange}
          {...dynamicFileInputArgs}
        />
        <button
          className="btn btn-square"
          onClick={handleUpload}
          disabled={!selectedFiles}
        >
          <RiArrowUpCircleLine size={32} />
        </button>
      </div>
      <div className="flex flex-col w-full">
        {progresses.map(({ file, loaded, total }) => (
          <div key={file} className="flex flex-row items-center">
            <small className="w-[100px] mr-2 truncate" key={file}>
              {file}
            </small>
            <progress
              className="progress progress-success w-full"
              value={loaded}
              max={total}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
