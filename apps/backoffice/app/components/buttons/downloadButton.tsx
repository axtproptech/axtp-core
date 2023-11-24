import { Button, CircularProgress, Tooltip } from "@mui/material";
import { IconDownload, IconDownloadOff } from "@tabler/icons";
import { FC, useState } from "react";
import { R2ObjectUri } from "@axtp/core/file/r2ObjectUri";
import { fileService } from "@/app/services/fileService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import IconButton from "@mui/material/IconButton";

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
  size?: "small" | "large";
}

export const DownloadButton: FC<Props> = ({
  url,
  label = "DownLoad",
  size = "large",
}) => {
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
    return size === "small" ? (
      <Tooltip title={label}>
        <IconButton color="info" onClick={handleR2ObjectUri}>
          {isProcessing ? <CircularProgress size={24} /> : <IconDownload />}
        </IconButton>
      </Tooltip>
    ) : (
      <Button variant="contained" color="info" onClick={handleR2ObjectUri}>
        {isProcessing ? <CircularProgress size={24} /> : <IconDownload />}
        {label}
      </Button>
    );
  }

  if (size === "small") {
    return url ? (
      <a href={url} download>
        <Tooltip title={label}>
          <IconButton color="info">
            <IconDownload />
          </IconButton>
        </Tooltip>
      </a>
    ) : (
      <Tooltip title={"Broken Link"}>
        <IconButton color="error">
          <IconDownloadOff />
        </IconButton>
      </Tooltip>
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
