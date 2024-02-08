import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import { IconUserCheck } from "@tabler/icons";

export type CreditorsActionType = "register";

interface Props {
  onAction: (action: CreditorsActionType) => void;
  isExecuting: boolean;
}

export const CreditorsActions = ({ onAction, isExecuting }: Props) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="Register Creditor"
          actionIcon={<IconUserCheck />}
          color="success"
          onClick={() => onAction("register")}
          isLoading={isExecuting}
        />
      </Box>
    </Box>
  );
};
