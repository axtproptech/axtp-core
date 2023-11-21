import { Button, CircularProgress, Tooltip } from "@mui/material";
import { IconDownload, IconDownloadOff } from "@tabler/icons";
import { FC, useEffect, useState } from "react";
import { R2ObjectUri } from "@axtp/core/file";
import { fileService } from "@/app/services/fileService";
import { useSnackbar } from "@/app/hooks/useSnackbar";

function isR2ObjectUri(uri: string): boolean {
  try {
    R2ObjectUri.fromUrl(uri);
    return true;
  } catch {
    return false;
  }
}

interface Props {
  url: string;
  label?: string;
}

export const DownloadButton: FC<Props> = ({ url, label = "DownLoad" }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showError } = useSnackbar();

  const handleR2ObjectUri = async () => {
    try {
      setIsProcessing(true);
      const {
        parts: { objectId },
      } = R2ObjectUri.fromUrl(url);
      const signedUrl = await fileService.getDownloadUrl(objectId);
      window.open(signedUrl.signedUrl);
    } catch (e: any) {
      console.error("Could not get download url", e);
      showError("Could get download url");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isR2ObjectUri(url)) {
    return (
      <Button variant="contained" color="info" onClick={handleR2ObjectUri}>
        {isProcessing ? <CircularProgress size={24} /> : <IconDownload />}
        {label}
      </Button>
    );
  }

  return url ? (
    <a href={url} download>
      <Button variant="contained" color="info">
        <IconDownload />
        {label}
      </Button>
    </a>
  ) : (
    <Tooltip title={"Broken Link"}>
      <Button variant="outlined" color="error">
        <>
          <IconDownloadOff />
          {label}
        </>
      </Button>
    </Tooltip>
  );
};
