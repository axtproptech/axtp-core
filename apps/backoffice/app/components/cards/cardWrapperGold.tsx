import { styled } from "@mui/material";
import { MainCard } from "@/app/components/cards/mainCard";

export const CardWrapperGold = styled(MainCard)(({ theme }) => ({
  // @ts-ignore
  backgroundColor: theme.palette.gold.main,
  color: "#fff",
  overflow: "hidden",
  borderRadius: "12px",
  position: "relative",
}));
