import { styled } from "@mui/material";
import { MainCard } from "@/app/components/cards/mainCard";

export const CardWrapperBlack = styled(MainCard)(({ theme }) => ({
  // @ts-ignore
  backgroundColor: theme.palette.grey[900],
  color: "#fff",
  overflow: "hidden",
  borderRadius: "12px",
  position: "relative",
}));
