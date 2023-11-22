import { customerService } from "@/app/services/customerService/customerService";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { toDateStr } from "@/app/toDateStr";
import { DownloadButton } from "@/app/components/buttons/downloadButton";
import { Document } from "@/bff/types/customerFullResponse";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { Stack } from "@mui/material";
import { IconFileMinus } from "@tabler/icons";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useState } from "react";
import { useSWRConfig } from "swr";

interface Props {
  document: Document;
  cuid: string;
}

const DocumentDeleteButton = ({ document, cuid }: Props) => {
  const [processing, setProcessing] = useState(false);
  const { mutate } = useSWRConfig();
  const { showError } = useSnackbar();

  const handleOnDelete = async () => {
    try {
      setProcessing(true);
      await customerService.with(cuid).deleteDocument(document.id);
      mutate(`getCustomer/${cuid}`);
    } catch (e) {
      showError("Could not delete document");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ActionButton
      actionLabel="Delete"
      onClick={handleOnDelete}
      actionIcon={<IconFileMinus />}
      color="error"
      isLoading={processing}
    />
  );
};

export const DocumentItem = ({ document, cuid }: Props) => {
  return (
    <>
      <LabeledTextField label="Type" text={document.type} />
      <LabeledTextField
        label="Upload Date"
        text={toDateStr(new Date(document.createdAt))}
      />
      <Stack direction="row" spacing={2}>
        <DownloadButton url={document.url} />
        <DocumentDeleteButton document={document} cuid={cuid} />
      </Stack>
    </>
  );
};
