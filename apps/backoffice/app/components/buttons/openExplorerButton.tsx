import { ExternalLink } from "@/app/components/externalLink";
import { Config } from "@/app/config";
import { Button } from "@mui/material";
import { IconLink } from "@tabler/icons";
import { FC } from "react";

interface Props {
  id: string;
  type: "tx" | "asset" | "at";
  label?: string;
}

export const OpenExplorerButton: FC<Props> = ({
  id,
  type,
  label = "Open in Explorer",
}) => (
  <ExternalLink href={`${Config.Signum.Explorer}${type}/${id}`}>
    <Button>
      <IconLink />
      {label}
    </Button>
  </ExternalLink>
);
