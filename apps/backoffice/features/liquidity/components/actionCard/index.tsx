import { MainCard } from "@/app/components/cards";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import { ChildrenProps } from "@/types/ChildrenProps";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  actionIcon?: ReactNode;
  onClick: () => void;
  color?: any;
  isLoading?: boolean;
}

const Action: FC<Props> = ({
  actionLabel,
  actionIcon,
  color = "primary",
  onClick,
  isLoading = false,
}) => (
  <Box sx={{ display: "flex", flexDirection: "row" }}>
    {isLoading ? (
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={isLoading}
      >
        <CircularProgress size={24} />
        &nbsp;{actionLabel}
      </Button>
    ) : (
      <Button
        variant="contained"
        color={color}
        onClick={onClick}
        disabled={isLoading}
      >
        {actionIcon}&nbsp;{actionLabel}
      </Button>
    )}
  </Box>
);

export const ActionCard: FC<Props & ChildrenProps> = (props) => {
  const { title, description, children } = props;
  return (
    <MainCard title={title} actions={<Action {...props} />}>
      <Typography variant="subtitle2">{description}</Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </MainCard>
  );
};
