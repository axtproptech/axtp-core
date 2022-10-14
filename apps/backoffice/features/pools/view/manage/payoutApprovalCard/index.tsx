import { ActionCard } from "@/app/components/cards";
import { IconSeeding, IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { FC, useMemo } from "react";
import { ApprovalStatus } from "@/types/approvalStatus";
import { NumericFormat } from "react-number-format";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { asRSAddress } from "@/app/asRSAddress";
import { useAccount } from "@/app/hooks/useAccount";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { Payments } from "@mui/icons-material";
import { usePoolContract } from "@/app/hooks/usePoolContract";

const getApprovalState = (status: ApprovalStatus, token: BasicTokenInfo) => {
  const isPayoutRequested = parseInt(status.quantity, 10) > 0;
  return [
    {
      label: isPayoutRequested ? (
        <div>
          Pending Payout{" "}
          <NumericFormat
            value={status.quantity}
            displayType="text"
            thousandSeparator
            fixedDecimalScale
            decimalScale={2}
          />{" "}
          {token.name.toUpperCase()}
        </div>
      ) : (
        "No Pending Request"
      ),
      icon: <Payments />,
      completed: isPayoutRequested,
    },
    {
      label: status.approvedAccounts[0]
        ? `Approved by ${asRSAddress(status.approvedAccounts[0])}`
        : "1st Approval",
      icon: <IconUserCheck />,
      completed: !!status.approvedAccounts[0],
    },
    {
      label: status.approvedAccounts[1]
        ? `Approved by ${asRSAddress(status.approvedAccounts[1])}`
        : "2nd Approval",
      icon: <IconUserCheck />,
      completed: !!status.approvedAccounts[1],
    },
    {
      label: status.approvedAccounts[2]
        ? `Approved by ${asRSAddress(status.approvedAccounts[2])}`
        : "3rd Approval",
      icon: <IconUserCheck />,
      completed: !!status.approvedAccounts[2],
    },
  ];
};

interface Props {
  poolId: string;
}

export const PayoutApprovalCard: FC<Props> = ({ poolId }) => {
  const { accountId } = useAccount();
  const { approvalStatusDistribution, token } = usePoolContract(poolId);
  const { execute, isExecuting, transactionId } = useLedgerAction();

  const approvalState = useMemo(() => {
    return getApprovalState(approvalStatusDistribution, token);
  }, [approvalStatusDistribution, token]);

  const canApprove = useMemo(() => {
    if (!accountId) return false;

    const isPaymentRequested =
      parseInt(approvalStatusDistribution.quantity, 10) > 0;
    const hasApprovedAlready =
      approvalStatusDistribution.approvedAccounts.includes(accountId);
    return isPaymentRequested && !hasApprovedAlready;
  }, [approvalStatusDistribution, accountId]);

  const handleOnApproveAction = () => {
    execute((service) =>
      service.poolContract.with(poolId).approveDistribution()
    );
  };

  return (
    <ActionCard
      title="Approve Dividend Payout"
      description="Here you can see if there's a pending dividend payout request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Payout"
      onClick={handleOnApproveAction}
      isLoading={isExecuting}
      disabled={!canApprove}
    >
      <Box sx={{ width: "100%", p: 0.5 }}>
        <ApprovalStepper state={approvalState} />
      </Box>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
