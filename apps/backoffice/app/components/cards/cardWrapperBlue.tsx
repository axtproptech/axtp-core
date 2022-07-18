import { styled } from "@mui/material";
import { MainCard } from "@/app/components/cards/mainCard";

export const CardWrapperBlue = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: "#fff",
  overflow: "hidden",
  borderRadius: "12px",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    // @ts-ignore
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: 72,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    // @ts-ignore
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: 32,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));
