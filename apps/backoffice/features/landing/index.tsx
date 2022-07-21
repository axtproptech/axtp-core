import { Grid, Typography } from "@mui/material";
import { CardWrapperDark, MainCard } from "@/app/components/cards";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { Animate } from "@/app/components/animation";
import { useState } from "react";

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
      <Grid item xs={3} />
      <Grid item xs={6}>
        <MainCard title="R.Est Landing Page" darkTitle>
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
