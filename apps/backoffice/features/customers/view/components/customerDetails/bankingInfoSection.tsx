import { Box, Typography } from "@mui/material";
import { EditableField } from "../editableField";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { customerService } from "@/app/services/customerService/customerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconBuildingBank } from "@tabler/icons";
import { AddBankInfoDialog } from "./addBankInfoDialog";
import { useState } from "react";
interface Props {
  customer: CustomerFullResponse;
}

export const BankingInfoSection = ({ customer }: Props) => {
  const { mutate } = useSWRConfig();
  const { showError, showWarning } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const bankingInfo = customer.bankInformation.length
    ? customer.bankInformation[0]
    : undefined;

  const handleBankingInfoChange = async (name: string, updatedData: any) => {
    try {
      if (!bankingInfo) {
        showWarning("No Banking Information Available");
        return;
      }
      await customerService.with(customer.cuid).updateBankingInfo({
        bankInfoId: bankingInfo.id,
        identifier: updatedData,
        type: "Pix",
      });
    } catch (e: any) {
      console.error("Updating Banking Info failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${customer.cuid}`);
    }
  };

  if (!bankingInfo) {
    return (
      <>
        <Typography variant="h4">Banking Information</Typography>
        <Box sx={{ textAlign: "center", my: 2, w: "100%" }}>
          <ActionButton
            actionLabel={"Add Info"}
            onClick={() => setDialogOpen(true)}
            actionIcon={<IconBuildingBank />}
          />
          <AddBankInfoDialog
            cuid={customer.cuid}
            onClose={() => setDialogOpen(false)}
            open={dialogOpen}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4">Banking Information</Typography>
      <EditableField
        label="Pix"
        initialValue={bankingInfo.identifier}
        name="identifier"
        onSubmit={handleBankingInfoChange}
      />
    </>
  );
};
