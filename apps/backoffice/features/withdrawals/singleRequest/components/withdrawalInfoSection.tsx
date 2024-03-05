import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { useMasterContract } from "@/app/hooks/useMasterContract";
import { ChainValue } from "@signumjs/util";
import { Config } from "@/app/config";
import { SingleWithdrawalRequestInfo } from "../singleWithdrawalRequestInfo";
import { useSelector } from "react-redux";
import { selectUsdBrlMarketState } from "@/app/states/marketDataState/selectors";

interface Props {
  requestInfo?: SingleWithdrawalRequestInfo;
}

export const WithdrawalInfoSection = ({ requestInfo }: Props) => {
  const { token: axtcToken } = useMasterContract();
  const usdBrlMarket = useSelector(selectUsdBrlMarketState);

  const isLoadingMarketData = !usdBrlMarket;

  if (!requestInfo) {
    return (
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  let inUsd = "";
  let inBrl = "";
  const amount = ChainValue.create(requestInfo.tokenInfo.decimals).setAtomic(
    requestInfo.creditQuantity
  );
  if (axtcToken.id === requestInfo.tokenInfo.id && usdBrlMarket) {
    inUsd = amount.getCompound();
    inBrl = amount
      .clone()
      .multiply(
        usdBrlMarket.current_price - Config.Platform.Market.PriceAdjustment
      )
      .getCompound();
  }

  // TOOD: consider later the AXTBR token

  return (
    <>
      <Stack direction="column" spacing={1} alignItems="center" mb={2}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
          pr={2}
        >
          <Typography variant="h4">Request Info</Typography>
          <Typography variant="caption">
            Last Updated Market Data:&nbsp;
            {isLoadingMarketData ? "Updating..." : usdBrlMarket?.last_updated}
          </Typography>
          <Typography variant="caption">
            1 USD =&nbsp;
            {isLoadingMarketData
              ? "Updating..."
              : Math.max(
                  0,
                  (usdBrlMarket?.current_price || 0) -
                    Config.Platform.Market.PriceAdjustment
                ).toFixed(4)}
            {" BRL"}
            (adjusted)
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          width={"100%"}
          pr={2}
        >
          <LabeledTextField
            label="Withdrawal Amount"
            text={`${amount.getCompound()} ${requestInfo.tokenInfo.name}`}
          />
          <LabeledTextField
            label="In USD"
            text={isLoadingMarketData ? "Loading...." : inUsd}
          />
          <LabeledTextField
            label="In BRL"
            text={isLoadingMarketData ? "Loading...." : inBrl}
          />
        </Stack>
      </Stack>
    </>
  );
};
