import { Box, Button } from "@mui/material";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useMemo, useState } from "react";
import { MainCard } from "@/app/components/cards";
import { RequestView } from "./components/requestView";
import router, { useRouter } from "next/router";
import {
  SingleRequestActions,
  SingleRequestActionType,
} from "@/features/withdrawals/singleRequest/components/singleRequestActions";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import {
  ConfirmationArgs,
  ConfirmPayoutDialog,
} from "@/features/withdrawals/singleRequest/components/confirmPayoutDialog";

interface Props {
  accountId: string;
  tokenId: string;
}

export const SingleWithdrawalRequest = ({ accountId, tokenId }: Props) => {
  const { back } = useRouter();
  const { tokenAccountCredits } = useBurnContract();
  const [isExecuting, setIsExecuting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const request = useMemo(() => {
    const tac = tokenAccountCredits.find((t) => t.tokenInfo.id === tokenId);
    if (tac) {
      const ac = tac.accountCredits.find((ac) => ac.accountId === accountId);
      return ac
        ? {
            tokenInfo: tac.tokenInfo,
            ...ac,
          }
        : null;
    }
    return null;
  }, [accountId, tokenAccountCredits, tokenId]);

  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    error: errorCustomer,
  } = useSWR(`fetchCustomer/${accountId}`, async () => {
    const customer = await customerService.fetchCustomerByAccountId(accountId);
    return customerService.with(customer.cuid).fetchCustomer();
  });

  if (!request) {
    return (
      <MainCard title={`Withdrawal Request`}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Invalid Request</h2>
          <Button variant="contained" color="primary" onClick={back}>
            Back
          </Button>
        </Box>
      </MainCard>
    );
  }

  function handleActions(action: SingleRequestActionType) {
    console.log("action: ", action);
    if (action === "confirm-payout") {
      setConfirmDialogOpen(true);
      // todo
    } else if (action === "view-customer") {
      router.push(`/admin/customers/${customerData?.cuid}`);
    }
  }

  async function handleConfirmPayout(args: ConfirmationArgs) {
    console.log("handleConfirmPayout", args);
  }

  return (
    <MainCard
      title={`Withdrawal Request ${request.tokenInfo.name}`}
      actions={
        <SingleRequestActions
          onAction={handleActions}
          isExecuting={isExecuting}
          customer={customerData}
        />
      }
    >
      <RequestView
        accountId={accountId}
        customer={customerData}
        requestInfo={request}
        isLoading={isLoadingCustomer}
      />
      <ConfirmPayoutDialog
        open={confirmDialogOpen}
        onClose={handleConfirmPayout}
        onCancel={() => {
          setConfirmDialogOpen(false);
        }}
        withdrawalRequestInfo={request}
      />
    </MainCard>
  );
};
