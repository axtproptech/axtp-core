import { ExternalLink } from "@/app/components/externalLink";
import { Config } from "@/app/config";
import { Button } from "@mui/material";
import { IconLink } from "@tabler/icons";
import { FC } from "react";

interface Props {
  id: string;
  type: "tx";
}

export const OpenExplorerButton: FC<Props> = ({ id, type }) => (
  <ExternalLink href={`${Config.Signum.Explorer}${type}/${id}`}>
    <Button>
      <IconLink />
      Open in Explorer
    </Button>
  </ExternalLink>
);
