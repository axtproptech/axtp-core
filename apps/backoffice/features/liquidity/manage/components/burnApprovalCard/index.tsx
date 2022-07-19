import { ActionCard } from "../../../components/actionCard";
import { IconFlame, IconSeeding, IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { HowToVoteRounded } from "@mui/icons-material";
import { ApprovalStatus, TokenInfo } from "@/types/masterContractData";
import NumberFormat from "react-number-format";
import { useMemo } from "react";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { useLedgerAction } from "@/app/hooks/useLedgerAction";
import { SucceededTransactionSection } from "@/app/components/sections/succeededTransactionSection";
import { asRSAddress } from "@/app/asRSAddress";

const getApprovalState = (status: ApprovalStatus, token: TokenInfo) => {
  const isBurningRequested = parseInt(status.quantity, 10) > 0;

  return [
    {
      label: isBurningRequested ? (
        <div>
          Burning{" "}
          <NumberFormat
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
      icon: <IconFlame />,
      completed: isBurningRequested,
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

export const BurnApprovalCard = () => {
  const { approvalStatusBurning, token } = useMasterContract();
  const { execute, isExecuting, transactionId } = useLedgerAction();

  const approvalState = useMemo(() => {
    return getApprovalState(approvalStatusBurning, token);
  }, [approvalStatusBurning, token]);

  const handleOnApproveAction = () => {
    execute((service) => service.masterContract.approveBurn());
  };

  return (
    <ActionCard
      title="Approve Liquidity Burning"
      description="Here you can see if there's a pending burning request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Burning"
      onClick={handleOnApproveAction}
      isLoading={isExecuting}
    >
      <Box sx={{ width: "100%", p: 0.5 }}>
        <ApprovalStepper state={approvalState} />
      </Box>
      <SucceededTransactionSection transactionId={transactionId} />
    </ActionCard>
  );
};
