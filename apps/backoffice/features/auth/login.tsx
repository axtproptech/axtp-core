import { Box, Button, Typography, useTheme } from "@mui/material";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";
import { MainCard } from "@/app/components/cards";
import { Animate } from "@/app/components/animation";
import { IconShieldLock } from "@tabler/icons";
import { useRouter } from "next/router";

interface Props {
  providers?: any;
}

export const Login: FC<Props> = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const { error } = router.query;

  const handleSignIn = () => {
    setSubmitting(true);
    signIn("auth0");
  };

  return (
    <MainCard
      title="Restricted Area"
      darkTitle
      sx={{
        maxWidth: { xs: 400, lg: 475 },
        margin: "auto",
        mt: "15%",
        "& > *": {
          flexGrow: 1,
          flexBasis: "50%",
        },
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
        <Box sx={{ textAlign: "center" }}>
          <IconShieldLock size={64} color={theme.palette.warning.main} />
          <Typography variant="h3">Authorized Personnel Only</Typography>
        </Box>
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
  );
};
