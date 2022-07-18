import { FC } from "react";
import { ChildrenProps } from "@/types/childrenProps";
import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

const Screen = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  minHeight: "100vh",
}));

export const MinimumLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <Screen>
      <Container sx={{ p: 4 }}>{children}</Container>
    </Screen>
  );
};
