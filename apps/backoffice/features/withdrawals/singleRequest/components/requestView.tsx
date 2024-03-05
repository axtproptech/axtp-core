import useSWR from "swr";
import { Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { BlockchainAccountSection } from "./blockchainAccountSection";
import { CustomerSection } from "./customerSection";
import { WithdrawalInfoSection } from "./withdrawalInfoSection";
import { SingleWithdrawalRequestInfo } from "../singleWithdrawalRequestInfo";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  accountId: string;
  requestInfo?: SingleWithdrawalRequestInfo;
  customer?: CustomerFullResponse;
  isLoading: boolean;
}

export const RequestView = ({
  requestInfo,
  accountId,
  customer,
  isLoading,
}: Props) => {
  const { ledgerService } = useLedgerService();

  const {
    data: accountData,
    isLoading: isLoadingAccount,
    error: errorAccount,
  } = useSWR(ledgerService ? `fetchAccount/${accountId}` : null, async () => {
    if (ledgerService) {
      return ledgerService.account.getAccount(accountId);
    }
  });

  return (
    <Grid
      container
      spacing={gridSpacing}
      direction="row"
      justifyContent="space-between"
      mt={1}
    >
      <Grid
        item
        xs={12}
        ml={4}
        mb={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <WithdrawalInfoSection requestInfo={requestInfo} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={5}
        ml={4}
        mb={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <CustomerSection customer={customer} isLoading={isLoading} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        ml={4}
        mb={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <BlockchainAccountSection
          account={accountData}
          isLoading={isLoadingAccount}
        />
      </Grid>
    </Grid>
  );
};
