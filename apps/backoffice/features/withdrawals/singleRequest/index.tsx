import { Box, Button, Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useBurnContract } from "@/app/hooks/useBurnContract";
import { useMemo, useState } from "react";
import { MainCard } from "@/app/components/cards";
import { CustomerView } from "./components/customerView";
import router, { useRouter } from "next/router";
import { SingleRequestActions } from "@/features/withdrawals/singleRequest/components/creditorsActions";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  accountId: string;
  tokenId: string;
}

export const SingleWithdrawalRequest = ({ accountId, tokenId }: Props) => {
  const { back } = useRouter();
  const { tokenAccountCredits } = useBurnContract();
  const [isExecuting, setIsExecuting] = useState(false);

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

  function handleActions(action: "confirm-payout") {
    console.log("action: ", action);
  }

  return (
    <MainCard
      title={`Withdrawal Request ${request.tokenInfo.name}`}
      actions={
        <SingleRequestActions
          onAction={handleActions}
          isExecuting={isExecuting}
        />
      }
    >
      <CustomerView accountId={accountId} />
    </MainCard>
  );
};
