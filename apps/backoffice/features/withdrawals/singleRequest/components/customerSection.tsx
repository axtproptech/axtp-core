import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { CustomerResponse } from "@/bff/types/customerResponse";
import { formatCpfCnpj } from "@/app/formatCpfCnpj";
import { ActivationChip } from "@/app/components/chips/activationChip";
import { BlockingChip } from "@/app/components/chips/blockingChip";
import { VerificationChip } from "@/app/components/chips/verificationChip";

interface Props {
  customer?: CustomerResponse;
  isLoading: boolean;
}

export const CustomerSection = ({ customer, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <CircularProgress />
      </Box>
    );
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
      </Stack>
      {/*<LabeledTextField label="Account Id" text={account.account}/>*/}
      {/*<LabeledTextField*/}
      {/*    label="Public Key"*/}
      {/*    text={account.publicKey.toUpperCase()}*/}
      {/*/>*/}
    </>
  );
};
