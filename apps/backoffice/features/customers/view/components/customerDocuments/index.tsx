import { Stack, Typography, Box } from "@mui/material";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { IconFilePlus } from "@tabler/icons";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { AddDocumentDialog } from "./addDocumentDialog";
import React, { useState } from "react";
import { DocumentsTable } from "./documentsTable";

interface Props {
  customer: CustomerFullResponse;
}

export const CustomerDocuments = ({ customer }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <Box
        sx={{
          mx: "auto",
          p: 2,
          width: {
            xs: "100%",
            lg: "50%",
          },
        }}
      >
        <DocumentsTable customer={customer} />
      </Box>
      <AddDocumentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cuid={customer.cuid}
      />
    </section>
  );
};
