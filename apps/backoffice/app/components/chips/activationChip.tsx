import { Chip, Tooltip } from "@mui/material";

interface Props {
  isActive: boolean;
}

export const ActivationChip = ({ isActive }: Props) => {
  // @ts-ignore
  return (
    <Tooltip title="Activation Status">
      <Chip
        label={isActive ? "Active" : "Deactivated"}
        color={isActive ? "success" : "warning"}
      />
    </Tooltip>
  );
};
