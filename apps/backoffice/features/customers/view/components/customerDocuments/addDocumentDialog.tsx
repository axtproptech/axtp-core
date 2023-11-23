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
import { SelectInput } from "@/app/components/inputs";
import { useState } from "react";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { FileInput } from "@/app/components/inputs/FileInput";
import { useSnackbar } from "@/app/hooks/useSnackbar";

import { IconUpload } from "@tabler/icons";
import { customerService } from "@/app/services/customerService/customerService";
import { useSWRConfig } from "swr";

const DocumentOptions = [
  { label: "Selfie", value: "Selfie" },
  { label: "Id", value: "Id" },
  { label: "DriverLicense", value: "DriverLicense" },
  { label: "Passport", value: "Passport" },
  { label: "ProofOfAddress", value: "ProofOfAddress" },
  { label: "Other", value: "Other" },
];

const DefaultOption = DocumentOptions[0];

export interface DocumentationAddedArgs {
  documentType: string;
  file: any;
}

interface Props {
  cuid: string;
  open: boolean;
  onClose: () => void;
}

export const AddDocumentDialog = ({ cuid, open, onClose }: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState(
    DefaultOption.value
  );
  const [isUploading, setIsUploading] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(0);
  const { showSuccess, showError, showWarning } = useSnackbar();
  const { mutate } = useSWRConfig();

  const handleUpload = async () => {
    try {
      if (!selectedFiles) {
        showWarning("No files selected");
        return;
      }
      setIsUploading(true);
      await customerService.with(cuid).uploadDocument({
        documentType: selectedDocumentType,
        file: selectedFiles[0],
        onProgress: (progress) => {
          const { total, loaded } = progress;
          if (total > 0) {
            setPercentUploaded((loaded / total) * 100);
          }
        },
      });
      await mutate(`getCustomer/${cuid}`);
      reset();
      showSuccess("Successfully uploaded");
    } catch (e) {
      console.log(e);
      showError("Mmmh, upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    // by spec this can't be fully reset
    setSelectedFiles(null);
    setSelectedDocumentType(DefaultOption.value);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // @ts-ignore
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        <Typography variant="h3">Add Document</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="subtitle1">
            You can upload a new document for the customer. The document will be
            stored securely according to data protection laws.
          </Typography>
        </DialogContentText>
        <SelectInput
          // @ts-ignore
          disabled={isUploading}
          label="Document Type"
          options={DocumentOptions}
          // @ts-ignore
          onChange={(e) => setSelectedDocumentType(e.target.value)}
          value={selectedDocumentType}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <FileInput
            // @ts-ignore
            disabled={isUploading}
            label="Document File"
            accept="image/*, .pdf"
            // @ts-ignore
            onChange={(e) => setSelectedFiles(e.target.files)}
            multiple={false}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <ActionButton
          actionLabel={
            isUploading ? `${percentUploaded.toFixed(0)} %` : "Upload"
          }
          onClick={handleUpload}
          isLoading={isUploading}
          actionIcon={<IconUpload />}
          disabled={selectedFiles === null}
        />
      </DialogActions>
    </Dialog>
  );
};
