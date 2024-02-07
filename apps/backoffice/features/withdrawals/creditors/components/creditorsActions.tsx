import { FC, useState } from "react";
import { Box } from "@mui/material";
import { ActionButton } from "@/app/components/buttons/actionButton";
import {
  IconCashBanknoteOff,
  IconCirclePlus,
  IconDiscount2,
} from "@tabler/icons";

export type CreditorsActionType = "register";

interface Props {
  onAction: (action: CreditorsActionType) => void;
  isExecuting: boolean;
}

export const CreditorsActions: FC<Props> = ({ onAction, isExecuting }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box sx={{ ml: 2 }}>
        <ActionButton
          actionLabel="Register Creditor"
          actionIcon={<IconDiscount2 />}
          color="success"
          onClick={() => onAction("register")}
          isLoading={isExecuting}
        />
      </Box>
    </Box>
  );
};
