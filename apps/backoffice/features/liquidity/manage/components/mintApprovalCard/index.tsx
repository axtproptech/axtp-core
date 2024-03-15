import { ActionCard } from "@/app/components/cards";
import { IconSeeding, IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useMemo } from "react";
import { ApprovalStatus } from "@/types/approvalStatus";
import { NumericFormat } from "react-number-format";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { asRSAddress } from "@/app/asRSAddress";
import { useAccount } from "@/app/hooks/useAccount";
import { BasicTokenInfo } from "@/types/basicTokenInfo";

const getApprovalState = (status: ApprovalStatus, token: BasicTokenInfo) => {
  const isMintingRequested = parseInt(status.quantity, 10) > 0;
  return [
    {
      label: isMintingRequested ? (
        <div>
          Minting{" "}
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
      icon: <IconSeeding />,
      completed: isMintingRequested,
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

export const MintApprovalCard = () => {
  const { accountId } = useAccount();
  const { approvalStatusMinting, token } = useMasterContract();
  const { execute, isExecuting, transactionId } = useLedgerAction();

  const approvalState = useMemo(() => {
    return getApprovalState(approvalStatusMinting, token);
  }, [approvalStatusMinting, token]);

  const canApprove = useMemo(() => {
    if (!accountId) return false;
    const isMintingRequested = parseInt(approvalStatusMinting.quantity, 10) > 0;
    const hasApprovedAlready =
      approvalStatusMinting.approvedAccounts.includes(accountId);
    return isMintingRequested && !hasApprovedAlready;
  }, [approvalStatusMinting, accountId]);

  const handleOnApproveAction = () => {
    execute((service) => service.axtcContract.approveMint());
  };

  return (
    <ActionCard
      title="Approve Liquidity Minting"
      description="Here you can see if there's a pending minting request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Minting"
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
