import { ActionCard } from "../actionCard";
import { IconSeeding, IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { HowToVoteRounded } from "@mui/icons-material";

const ApprovalState = [
  {
    label: "Requested Minting",
    icon: <HowToVoteRounded />,
    completed: true,
  },
  {
    label: "1st Approval",
    icon: <IconUserCheck />,
    completed: true,
  },
  {
    label: "2nd Approval",
    icon: <IconUserCheck />,
    completed: true,
  },
  {
    label: "2nd Approval",
    icon: <IconUserCheck />,
    completed: true,
  },
  {
    label: "Minted",
    icon: <IconSeeding />,
    completed: true,
  },
];

export const MintApprovalCard = () => {
  const handleOnApproveAction = () => {
    console.log("Minted...");
  };

  return (
    <ActionCard
      title="Approve Liquidity Minting"
      description="Here you can see if there's a pending minting request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Minting"
      onClick={handleOnApproveAction}
    >
      <Box sx={{ width: "100%", p: 0.5 }}>
        <ApprovalStepper state={ApprovalState} />
      </Box>
    </ActionCard>
  );
};
