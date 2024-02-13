import {
  Box,
  Chip,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { formatCpfCnpj } from "@/app/formatCpfCnpj";
import { ActivationChip } from "@/app/components/chips/activationChip";
import { BlockingChip } from "@/app/components/chips/blockingChip";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { useRouter } from "next/router";
import { IconEdit } from "@tabler/icons";

const NoBankingInfoChip = () => (
  <Tooltip title="No Banking Information available">
    <Chip label="Missing Banking Info" color="error" />
  </Tooltip>
);

interface Props {
  customer?: CustomerFullResponse;
  isLoading: boolean;
}

export const CustomerSection = ({ customer, isLoading }: Props) => {
  const router = useRouter();
  const bankingInfo = customer?.bankInformation?.length
    ? customer.bankInformation[0]
    : undefined;

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  function handleClickAddBankingInfo() {
    return router.push(`/admin/customers/${customer?.cuid}`);
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
          pr={2}
        >
          <Typography variant="h4">{`${customer?.firstName} ${customer?.lastName}`}</Typography>
          {customer && (
            <Stack direction="row" spacing={1} alignItems="center">
              {!bankingInfo && <NoBankingInfoChip />}
              <ActivationChip isActive={customer.isActive} />
              <BlockingChip isBlocked={customer.isBlocked} />
              <VerificationChip level={customer.verificationLevel} />
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="start"
        alignItems="center"
      >
        <div>
          <LabeledTextField
            label="CPF"
            text={formatCpfCnpj(customer?.cpfCnpj || "")}
          />
        </div>
        <div>
          <LabeledTextField label="E-Mail" text={customer?.email1 || ""} />
        </div>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="start"
        alignItems="center"
      >
        <div>
          <LabeledTextField label="Phone" text={customer?.phone1 || ""} />
        </div>
        <div>
          {bankingInfo ? (
            <LabeledTextField
              label={bankingInfo.type}
              text={bankingInfo.identifier}
            />
          ) : (
            <ActionButton
              actionLabel={"Add Banking Info"}
              onClick={handleClickAddBankingInfo}
              actionIcon={<IconEdit />}
            />
          )}
        </div>
      </Stack>
    </>
  );
};
