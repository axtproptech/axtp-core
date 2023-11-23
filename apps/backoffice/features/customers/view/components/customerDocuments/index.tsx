import { Grid, Stack, Typography } from "@mui/material";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { Config } from "@/app/config";
import { IconFilePlus } from "@tabler/icons";
import { DocumentItem } from "./documentItem";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  AddDocumentDialog,
  DocumentationAddedArgs,
} from "@/features/customers/view/components/customerDocuments/addDocumentDialog";
import { useState } from "react";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  customer: CustomerFullResponse;
}

export const CustomerDocuments = ({ customer }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { documents } = customer;

  return (
    <section>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        mr={2}
      >
        <Typography variant="h4">Documents</Typography>
        <ActionButton
          actionLabel="Add Document"
          onClick={() => setIsDialogOpen(true)}
          color="info"
          actionIcon={<IconFilePlus />}
        />
      </Stack>
      <Grid container spacing={gridSpacing} direction="row">
        {documents.map((d, index) => (
          <Grid item xs={12} lg={3} sx={{ my: 2 }} key={d.id}>
            <DocumentItem document={d} cuid={customer.cuid} />
          </Grid>
        ))}
      </Grid>
      <AddDocumentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cuid={customer.cuid}
      />
    </section>
  );
};
