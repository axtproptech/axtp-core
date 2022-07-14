import { Grid, Typography } from "@mui/material";
import { CardWrapperDark, MainCard } from "@/app/components/cards";
import { Box } from "@mui/system";
import { useRouter } from "next/router";

export const Landing = () => {
  const router = useRouter();

  const handleAdminPanel = () => {
    router.push("/admin");
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={3} />
      <Grid item xs={6}>
        <MainCard title="R.Est Landing Page" darkTitle>
          <CardWrapperDark>
            <Box
              onClick={handleAdminPanel}
              sx={{
                maxWidth: 280,
                m: "auto",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary.light">
                Admin Area
              </Typography>
            </Box>
          </CardWrapperDark>
        </MainCard>
      </Grid>
    </Grid>
  );
};
