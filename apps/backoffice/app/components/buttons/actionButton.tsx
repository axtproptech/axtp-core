import { FC, ReactNode } from "react";
import { Box, Button, CircularProgress, SxProps, Tooltip } from "@mui/material";

export interface ActionButtonProps {
  actionLabel: string;
  actionIcon?: ReactNode;
  onClick: (e: React.SyntheticEvent) => void;
  color?: any;
  disabled?: boolean;
  isLoading?: boolean;
  sx?: SxProps;
  sxButton?: SxProps;
  tooltip?: string;
}

export const ActionButton: FC<ActionButtonProps> = ({
  actionLabel,
  actionIcon,
  color = "primary",
  onClick,
  isLoading = false,
  disabled = false,
  sx = {},
  sxButton = {},
  tooltip = "",
}) => (
  <Box sx={{ display: "flex", flexDirection: "row", ...sx }}>
    {isLoading ? (
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={true}
        sx={sxButton}
      >
        <CircularProgress size={24} />
        &nbsp;{actionLabel}
      </Button>
    ) : (
      <Tooltip title={tooltip}>
        <Button
          variant="contained"
          color={color}
          onClick={onClick}
          disabled={disabled}
          sx={sxButton}
        >
          {actionIcon}&nbsp;{actionLabel}
        </Button>
      </Tooltip>
    )}
  </Box>
);
