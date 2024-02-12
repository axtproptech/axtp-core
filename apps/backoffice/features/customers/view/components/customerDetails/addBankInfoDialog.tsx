import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { SelectInput, TextInput } from "@/app/components/inputs";
import { useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { FileInput } from "@/app/components/inputs/FileInput";
import { useSnackbar } from "@/app/hooks/useSnackbar";

import { IconUpload } from "@tabler/icons";
import { customerService } from "@/app/services/customerService/customerService";
import { useSWRConfig } from "swr";

const BankInfoTypes = [
  { label: "Pix", value: "Pix" },
  { label: "IBAN", value: "Iban" },
];

const DefaultOption = BankInfoTypes[0];

interface Props {
  cuid: string;
  open: boolean;
  onClose: () => void;
}

export const AddBankInfoDialog = ({ cuid, open, onClose }: Props) => {
  const [identifier, setIdentifier] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError, showWarning } = useSnackbar();
  const { mutate } = useSWRConfig();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await customerService.with(cuid).createBankingInfo({
        identifier,
        type: "Pix",
      });
      await mutate(`getCustomer/${cuid}`);
      reset();
      showSuccess("Successfully saved.");
    } catch (e) {
      console.log(e);
      showError("Mmmh, saving failed!");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setIdentifier("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Add Banking Information</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            At this moment only Pix is supported. Add the PIX Key here.
          </Typography>
        </DialogContentText>
        {/*<SelectInput*/}
        {/*  // @ts-ignore*/}
        {/*  disabled={isUploading}*/}
        {/*  label="Document Type"*/}
        {/*  options={BankInfoTypes}*/}
        {/*  // @ts-ignore*/}
        {/*  onChange={(e) => setSelectedDocumentType(e.target.value)}*/}
        {/*  value={selectedDocumentType}*/}
        {/*/>*/}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextInput
            label="PIX Key"
            // @ts-ignore
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <ActionButton
          actionLabel="Save"
          onClick={handleSave}
          isLoading={isSaving}
          actionIcon={<IconUpload />}
          disabled={identifier.length === 0}
        />
      </DialogActions>
    </Dialog>
  );
};
