import { ActionCard } from "@/features/liquidity/view/components/actionCard";
import { IconFlame, IconUserCheck } from "@tabler/icons";
import { Box } from "@mui/material";
import { ApprovalStepper } from "@/app/components/approvalStepper";
import { HowToVoteRounded } from "@mui/icons-material";

const ApprovalState = [
  {
    label: "Requested Burning",
    icon: <HowToVoteRounded />,
    completed: false,
  },
  {
    label: "1st Approval",
    icon: <IconUserCheck />,
    completed: false,
  },
  {
    label: "2nd Approval",
    icon: <IconUserCheck />,
    completed: false,
  },
  {
    label: "2nd Approval",
    icon: <IconUserCheck />,
    completed: false,
  },
  {
    label: "Burnt",
    icon: <IconFlame />,
    completed: false,
  },
];

export const BurnApprovalCard = () => {
  const handleOnApproveAction = () => {
    console.log("Burnt...");
  };

  return (
    <ActionCard
      title="Approve Liquidity Burning"
      description="Here you can see if there's a pending burning request and its current approval state"
      actionIcon={<IconUserCheck />}
      actionLabel="Approve Burning"
      onClick={handleOnApproveAction}
    >
      <Box sx={{ width: "100%", p: 0.5 }}>
        <ApprovalStepper state={ApprovalState} />
      </Box>
    </ActionCard>
  );
};
