import { Box, Button, Grid, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";
import { styled } from "@mui/material/styles";
import { MainCard } from "@/app/components/Cards/MainCard";
import { Animate } from "@/app/components/Animation/Animate";
import { useRouter } from "next/router";

interface Props {
  providers?: any;
}

const AuthContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  minHeight: "100vh",
}));

export const Login: FC<Props> = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { error } = router.query;

  const handleSignIn = () => {
    setSubmitting(true);
    signIn("auth0");
  };

  return (
    <AuthContainer>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <MainCard
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  margin: { xs: 2.5, md: 3 },
                  "& > *": {
                    flexGrow: 1,
                    flexBasis: "50%",
                  },
                }}
                content={false}
              >
                <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
                  <h1>Some Logo here</h1>
                  {error && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography variant="subtitle1" color="error">
                        Authentication Failed
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Animate>
                      <Button
                        onClick={handleSignIn}
                        disableElevation
                        disabled={submitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                      >
                        Sign in
                      </Button>
                    </Animate>
                  </Box>
                </Box>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthContainer>
  );
};
