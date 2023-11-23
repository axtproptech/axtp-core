import { useState } from "react";
import { useSWRConfig } from "swr";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { customerService } from "@/app/services/customerService/customerService";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconFileMinus } from "@tabler/icons";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DialogProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
}

export const DeleteDocumentDialog = ({ open, onClose }: DialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">
          Do you want to delete this document?
        </Typography>
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => onClose(false)}>No</Button>
        <ActionButton
          actionLabel="Yes, delete it!"
          onClick={() => onClose(true)}
          color="error"
        />
      </DialogActions>
    </Dialog>
  );
};

interface Props {
  documentId: number;
  cuid: string;
  size?: "small" | "large";
}

export const DocumentDeleteButton = ({
  documentId,
  cuid,
  size = "large",
}: Props) => {
  const [processing, setProcessing] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const { showError } = useSnackbar();

  const deleteDocument = async () => {
    try {
      setProcessing(true);
      await customerService.with(cuid).deleteDocument(documentId);
      await mutate(`getCustomer/${cuid}`);
    } catch (e) {
      showError("Could not delete document");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      deleteDocument();
    }
    setConfirmationDialogOpen(false);
  };

  const openConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  return (
    <>
      {size === "small" ? (
        <Tooltip title="Delete">
          <IconButton color="error" onClick={openConfirmationDialog}>
            {processing ? <CircularProgress size={24} /> : <IconFileMinus />}
          </IconButton>
        </Tooltip>
      ) : (
        <ActionButton
          actionLabel="Delete"
          onClick={openConfirmationDialog}
          actionIcon={<IconFileMinus />}
          color="error"
          isLoading={processing}
        />
      )}
      <DeleteDocumentDialog
        open={confirmationDialogOpen}
        onClose={handleConfirmation}
      />
    </>
  );
};
