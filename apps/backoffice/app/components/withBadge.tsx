import { FC } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { Badge } from "@mui/material";

interface WithBadgeProps {
  value: string;
  color?: string;
}

export const WithBadge: FC<WithBadgeProps & ChildrenProps> = ({
  value,
  color = "warning",
  children,
}) => {
  if (!value) {
    return <>{children}</>;
  }
  return (
    // @ts-ignore
    <Badge badgeContent={value} color={color}>
      {children}
    </Badge>
  );
};
