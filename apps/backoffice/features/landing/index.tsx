import { Grid, styled, Typography } from "@mui/material";
import { CardWrapperDark, MainCard } from "@/app/components/cards";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Animate } from "@/app/components/animation";
import { useState } from "react";

const Background = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  // backgroundImage: `url(${})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

export const Landing = () => {
  const router = useRouter();
  const [isRouting, setIsRouting] = useState(false);
  const handleAdminPanel = () => {
    if (isRouting) return;
    setIsRouting(true);
    router.push("/admin");
  };
  return (
    <Grid container spacing={2}>
      <Background />
      <Grid item xs={3} />
      <Grid item xs={6}>
        <MainCard title="AXT Landing Page" darkTitle>
          <Animate>
            <Box
              onClick={handleAdminPanel}
              sx={{
                m: "auto",
                textAlign: "center",
                cursor: "pointer",
                filter: isRouting ? "saturate(0.1) brightness(2)" : "",
              }}
            >
              <CardWrapperDark>
                <Typography variant="h4" color="primary.light">
                  Admin Area
                </Typography>
              </CardWrapperDark>
            </Box>
          </Animate>
        </MainCard>
      </Grid>
    </Grid>
  );
};
