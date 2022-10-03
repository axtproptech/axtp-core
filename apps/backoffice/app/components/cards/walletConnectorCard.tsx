// material-ui
import { styled } from "@mui/material/styles";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Animate } from "@/app/components/animation";
import { useAccount } from "@/app/hooks/useAccount";
import {
  requestWalletConnection,
  requestWalletDisconnection,
} from "@/app/requestWalletConnection";
import { ExternalLink } from "@/app/components/links/externalLink";

const CardStyle = styled(Card)(({ theme, ...props }) => {
  // @ts-ignore
  const principalColor = props.isConnected
    ? theme.palette.success
    : theme.palette.warning;
  return {
    background: principalColor.light,
    marginTop: "16px",
    marginBottom: "16px",
    overflow: "hidden",
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      width: "200px",
      height: "200px",
      border: "19px solid ",
      borderColor: principalColor.main,
      borderRadius: "50%",
      top: "65px",
      right: "-150px",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      width: "200px",
      height: "200px",
      border: "3px solid ",
      borderColor: principalColor.main,
      borderRadius: "50%",
      top: "145px",
      right: "-70px",
    },
  };
});

export const WalletConnectorCard = () => {
  const { rsAddress, isConnected } = useAccount();

  const toggleConnection = () => {
    isConnected ? requestWalletDisconnection() : requestWalletConnection();
  };

  return (
    // @ts-ignore
    <CardStyle isConnected={isConnected}>
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h4">
              {isConnected ? "Connected to XT Wallet" : "Connect XT Wallet"}
            </Typography>
          </Grid>
          <Grid item>
            {!isConnected ? (
              <Typography
                variant="subtitle2"
                color="grey.900"
                sx={{ opacity: 0.6 }}
              >
                Get it for{" "}
                <ExternalLink href="https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib">
                  Google Chrome
                </ExternalLink>{" "}
                or{" "}
                <ExternalLink href="https://addons.mozilla.org/en-US/firefox/addon/signum-xt-wallet">
                  Mozilla Firefox
                </ExternalLink>
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                color="grey.900"
                sx={{ opacity: 0.6 }}
              >
                Connected as <b>{rsAddress}</b>
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Stack direction="row">
              <Animate>
                <Button
                  variant="contained"
                  color={isConnected ? "success" : "warning"}
                  sx={{ boxShadow: "none" }}
                  onClick={toggleConnection}
                >
                  {!isConnected ? "Connect" : "Disconnect"}
                </Button>
              </Animate>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </CardStyle>
  );
};
