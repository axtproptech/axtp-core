import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { Account } from "@signumjs/core";

interface Props {
  account?: Account;
  isLoading: boolean;
}

export const BlockchainAccountSection = ({ account, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Grid
        item
        xs={12}
        m={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CircularProgress />.
        </Box>
      </Grid>
    );
  }

  return (
    <Grid
      item
      xs={12}
      m={2}
      sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
    >
      {account ? (
        <>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4">Blockchain Account</Typography>
            <OpenExplorerButton id={account.account} type="address" />
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="start"
            alignItems="center"
          >
            <div>
              <LabeledTextField
                label="Account Address"
                text={account.accountRS}
              />
            </div>
          </Stack>
          <LabeledTextField label="Account Id" text={account.account} />
          <LabeledTextField
            label="Public Key"
            text={account.publicKey.toUpperCase()}
          />
        </>
      ) : (
        <>
          <Typography variant="h4">No Blockchain Account yet</Typography>
          <Typography variant="subtitle2">(Or wallet not connected)</Typography>
        </>
      )}
    </Grid>
  );
};
