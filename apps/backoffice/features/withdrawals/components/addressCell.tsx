import { GridRenderCellParams } from "@mui/x-data-grid";
import { ExternalLink } from "@/app/components/links/externalLink";
import { Button } from "@mui/material";
import { IconLink } from "@tabler/icons";

export const AddressCell = (params: GridRenderCellParams<string>) => {
  const explorerLink = params.row.explorerLink;
  if (!explorerLink) return null;

  return (
    <ExternalLink href={explorerLink}>
      <Button>
        <IconLink />
        {params.row.address}
      </Button>
    </ExternalLink>
  );
};
