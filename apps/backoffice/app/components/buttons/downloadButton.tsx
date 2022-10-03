import { Button, Tooltip } from "@mui/material";
import { IconDownload, IconDownloadOff } from "@tabler/icons";
import { FC } from "react";

interface Props {
  url: string;
  label?: string;
}

export const DownloadButton: FC<Props> = ({ url, label = "DownLoad" }) => {
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
