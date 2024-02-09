import { customerService } from "@/app/services/customerService/customerService";
import useSWR from "swr";
import { MainCard } from "@/app/components/cards";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { Grid, Stack, Typography } from "@mui/material";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { Config } from "@/app/config";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { BlockchainAccountSection } from "@/features/withdrawals/singleRequest/components/blockchainAccountSection";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  accountId: string;
}

export const CustomerView = ({ accountId }: Props) => {
  const { isLoading: isLoadingMC } = useMasterContract();
  const { ledgerService } = useLedgerService();

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    error: errorCustomer,
  } = useSWR(`fetchCustomer/${accountId}`, async () => {
    const customer = await customerService.fetchCustomerByAccountId(accountId);
    // TODO: fetch bank information
    return customer;
  });

  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: errorAccount,
  } = useSWR(ledgerService ? `fetchAccount/${accountId}` : null, async () => {
    if (ledgerService) {
      return ledgerService.account.getAccount(accountId);
    }
  });

  console.log("data", customerData);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <BlockchainAccountSection
        account={accountData}
        isLoading={isLoadingAccount}
      />

      <h2>TO DO - Customer date here</h2>
    </Grid>
  );
};
