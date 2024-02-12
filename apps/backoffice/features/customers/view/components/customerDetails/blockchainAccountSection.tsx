import { Stack, Typography } from "@mui/material";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

interface Props {
  customer: CustomerFullResponse;
}

export const BlockchainAccountSection = ({ customer }: Props) => {
  const account = customer.blockchainAccounts.length
    ? customer.blockchainAccounts[0]
    : undefined;
  if (!account) {
    return (
      <>
        <Typography variant="h4">Blockchain Account</Typography>
        <Typography variant="h4">No Blockchain Account yet</Typography>
        <Typography variant="subtitle2">(Or wallet not connected)</Typography>
      </>
    );
  }

  return (
    <>
      <Typography variant="h4">Blockchain Account</Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="start"
        alignItems="center"
      >
        <div>
          <LabeledTextField label="Account Address" text={account.rsAddress} />
        </div>
        <OpenExplorerButton id={account.accountId} type="address" />
      </Stack>
      <LabeledTextField label="Account Id" text={account.accountId} />
      <LabeledTextField
        label="Public Key"
        text={account.publicKey.toUpperCase()}
      />
    </>
  );
};
