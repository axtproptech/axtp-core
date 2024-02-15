import useSWR from "swr";
import { Box, Button } from "@mui/material";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useMemo, useState } from "react";
import { MainCard } from "@/app/components/cards";
import { RequestView } from "./components/requestView";
import router, { useRouter } from "next/router";
import { customerService } from "@/app/services/customerService/customerService";
import {
  SingleRequestActions,
  SingleRequestActionType,
} from "./components/singleRequestActions";
import {
  ConfirmationArgs,
  ConfirmPayoutDialog,
} from "./components/confirmPayoutDialog";
import { withdrawalService } from "@/app/services/withdrawalService/withdrawalService";
import { useLedgerService } from "@/app/hooks/useLedgerService";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { ChainValue } from "@signumjs/util";

interface Props {
  accountId: string;
  tokenId: string;
}

export const SingleWithdrawalRequest = ({ accountId, tokenId }: Props) => {
  const { back } = useRouter();
  const { tokenAccountCredits, trackableTokens } = useBurnContract();
  const { ledgerService } = useLedgerService();
  const { showError, showSuccess } = useSnackbar();
  const [isExecuting, setIsExecuting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const request = useMemo(() => {
    const tac = tokenAccountCredits.find((t) => t.tokenId === tokenId);
    const tt = trackableTokens[tokenId];
    if (tac && tt) {
      const ac = tac.accountCredits.find((ac) => ac.accountId === accountId);
      return ac
        ? {
            tokenInfo: tt,
            ...ac,
          }
        : null;
    }
    return null;
  }, [accountId, tokenAccountCredits, tokenId, trackableTokens]);

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
    if (action === "confirm-payout") {
      setConfirmDialogOpen(true);
    } else if (action === "view-customer") {
      router.push(`/admin/customers/${customerData?.cuid}`);
    }
  }

  const handleConfirmPayout = async (args: ConfirmationArgs) => {
    if (!request || !customerData || !ledgerService) return;
    // create a registry on chain
    // send transaction to smart contract
    try {
      const { cuid, blockchainAccounts } = customerData;
      if (!blockchainAccounts) return;

      const account = blockchainAccounts.length
        ? customerData.blockchainAccounts[0]
        : null;
      if (!account) {
        throw new Error(`Customer has no blockchain account`);
      }

      if (account.accountId !== accountId) {
        throw new Error(
          `Account Id mismatch: ${account.accountId} vs. ${accountId}`
        );
      }

      const paidTokenQnt = ChainValue.create(
        request.tokenInfo.decimals
      ).setCompound(args.payableTokenAmount);
      await ledgerService.burnContract.creditToken(
        request.tokenInfo.id,
        paidTokenQnt,
        accountId
      );
      await withdrawalService.registerWithdrawal({
        accountPk: account.publicKey,
        customerId: cuid,
        amount: args.paidFiatAmount,
        currency: args.currency.toLowerCase(),
        tokenId: request.tokenInfo.id,
        tokenName: request.tokenInfo.name,
        tokenQnt: paidTokenQnt.getAtomic(),
        usd: args.payableTokenAmount,
        paymentType: "Pix",
        txId: args.paymentReference,
      });
      showSuccess("Successfully registered payment");
      setConfirmDialogOpen(false);
    } catch (e: any) {
      showError(`Something failed: ${e.message}`);
      throw e;
    } finally {
      setIsExecuting(false);
    }
  };

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
