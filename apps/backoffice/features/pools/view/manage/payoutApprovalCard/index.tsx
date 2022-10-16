import { ActionCard } from "@/app/components/cards";
import { IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { FC, useMemo } from "react";
import { ApprovalStatus } from "@/types/approvalStatus";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { asRSAddress } from "@/app/asRSAddress";
import { useAccount } from "@/app/hooks/useAccount";
import { BasicTokenInfo } from "@/types/basicTokenInfo";
import { Payments } from "@mui/icons-material";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { Number } from "@/app/components/number";

const getApprovalState = (status: ApprovalStatus, token: BasicTokenInfo) => {
  const hasPayoutBalance = parseInt(status.quantity, 10) > 0;
  return [
    {
      label: hasPayoutBalance ? (
        <div>
          Available for Payout&nbsp;
          <Number value={status.quantity} decimals={2} suffix={token.name} />
        </div>
      ) : (
        `No ${token.name} balance`
      ),
      icon: <Payments />,
      completed: hasPayoutBalance,
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
  const { token } = useMasterContract();
  const { approvalStatusDistribution } = usePoolContract(poolId);
  const { execute, isExecuting, transactionId } = useLedgerAction();

  const approvalState = useMemo(() => {
    return getApprovalState(approvalStatusDistribution, token);
  }, [approvalStatusDistribution, token]);

  const canApprove = useMemo(() => {
    if (!accountId) return false;

    const hasPayoutBalance =
      parseFloat(approvalStatusDistribution.quantity) > 0;
    const hasApprovedAlready =
      approvalStatusDistribution.approvedAccounts.includes(accountId);
    return hasPayoutBalance && !hasApprovedAlready;
  }, [approvalStatusDistribution, accountId]);

  const handleOnApproveAction = () => {
    execute((service) =>
      service.poolContract.with(poolId).approveDistribution()
    );
  };

  return (
    <ActionCard
      title="Approve Dividend Payout"
      description="A pool with positive balance is automatically eligible for dividend distribution."
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
