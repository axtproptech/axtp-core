import { ActionCard } from "@/app/components/cards";
import { IconSend, IconUserCheck } from "@tabler/icons";
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
import { useAppSelector } from "@/states/hooks";
import { selectPoolContractState } from "@/app/states/poolsState";

const getApprovalState = (status: ApprovalStatus, token: BasicTokenInfo) => {
  const isSendingRequested = parseInt(status.quantity, 10) > 0;
  return [
    {
      label: isSendingRequested ? (
        <div>
          Sending{" "}
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
      icon: <IconSend />,
      completed: isSendingRequested,
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

export const SendToPoolApprovalCard = () => {
  const { accountId } = useAccount();
  const { approvalStatusSendToPool, token, currentSendPoolAddress } =
    useMasterContract();
  const { execute, isExecuting, transactionId } = useLedgerAction();
  const currentPool = useAppSelector(
    selectPoolContractState(currentSendPoolAddress)
  );

  const approvalState = useMemo(() => {
    return getApprovalState(approvalStatusSendToPool, token);
  }, [approvalStatusSendToPool, token]);

  const canApprove = useMemo(() => {
    if (!accountId) return false;
    const isSendingRequested =
      parseInt(approvalStatusSendToPool.quantity, 10) > 0;
    const hasApprovedAlready =
      approvalStatusSendToPool.approvedAccounts.includes(accountId);
    return isSendingRequested && !hasApprovedAlready;
  }, [approvalStatusSendToPool, accountId]);

  const handleOnApproveAction = () => {
    execute((service) => service.axtcContract.approveSendToPool());
  };

  return (
    <ActionCard
      title={`Approve Sending to Pool ${
        currentPool ? currentPool.token.name : ""
      }`}
      description="Here you can see if there's a pending send request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Sending"
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
