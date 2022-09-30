import { FC, ReactNode } from "react";
import { Box, Button, CircularProgress } from "@mui/material";

export interface ActionButtonProps {
  actionLabel: string;
  actionIcon?: ReactNode;
  onClick: () => void;
  color?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ActionButton: FC<ActionButtonProps> = ({
  actionLabel,
  actionIcon,
  color = "primary",
  onClick,
  isLoading = false,
  disabled = false,
}) => (
  <Box sx={{ display: "flex", flexDirection: "row" }}>
    {isLoading ? (
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={true}
      >
        <CircularProgress size={24} />
        &nbsp;{actionLabel}
      </Button>
    ) : (
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={disabled}
      >
        {actionIcon}&nbsp;{actionLabel}
      </Button>
    )}
  </Box>
);
