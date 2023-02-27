import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Input,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import { Config } from "@/app/config";
import { FC, useMemo } from "react";
import { customerService } from "@/app/services/customerService/customerService";
import useSWR, { useSWRConfig } from "swr";
import { MainCard } from "@/app/components/cards";
import {
  CustomerActions,
  CustomerActionType,
} from "./components/customerActions";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { ExternalLink } from "@/app/components/links/externalLink";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { useExplorerLink } from "@/app/hooks/useExplorerLink";
import { cpf } from "cpf-cnpj-validator";
import { useRouter } from "next/router";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { PaymentFullResponse } from "@/bff/types/paymentFullResponse";
import { PaymentStatusChip } from "@/features/payments/view/components/cellRenderer/renderPaymentStatus";
import { PaymentStatus } from "@/types/paymentStatus";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import { Number } from "@/app/components/number";
import { useAppContext } from "@/app/hooks/useAppContext";
import { shortenHash } from "@/app/shortenHash";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { IconCopy } from "@tabler/icons";

const gridSpacing = Config.Layout.GridSpacing;

export const SinglePayment = () => {
  const router = useRouter();
  const txid = router.query.txid as string;
  const { getAccountLink } = useExplorerLink();
  const { mutate } = useSWRConfig();
  const { data: payment, error } = useSWR(
    txid ? `getPayment/${txid}` : null,
    () => {
      return paymentsService.with(txid).fetchPayment();
    }
  );

  // TODO: payment actions
  const verifyCustomer = async () => {
    try {
      await customerService.with(txid).verifyCustomer("Level1");
      await Promise.all([
        mutate(`getCustomer/${txid}`),
        mutate("getPendingTokenHolders"),
      ]);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const activateCustomer = async (isActive: boolean) => {
    try {
      await customerService.with(txid).setCustomerActivationState(isActive);
      await mutate(`getCustomer/${txid}`);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const blockCustomer = async (isBlocked: boolean) => {
    try {
      await customerService.with(txid).setCustomerBlockingState(isBlocked);
      await mutate(`getCustomer/${txid}`);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const handleCustomerAction = async (action: CustomerActionType) => {
    switch (action) {
      case "verify":
        return verifyCustomer();
      case "activate":
        return activateCustomer(true);
      case "deactivate":
        return activateCustomer(false);
      case "block":
        return blockCustomer(true);
      case "unblock":
        return blockCustomer(false);
      default:
        return new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 2000);
        });
    }
  };
  const availableActions = useMemo(() => {
    const actions = new Set<CustomerActionType>();
    if (!payment) return actions;
    //
    // if (
    //   payment.verificationLevel === "Pending" ||
    //   payment.verificationLevel === "NotVerified"
    // ) {
    //   actions.add("verify");
    // }
    // actions.add(payment.isActive ? "deactivate" : "activate");
    // actions.add(payment.isBlocked ? "unblock" : "block");
    return actions;
  }, [payment]);

  const loading = !payment && !error;

  // TODO: handle error

  if (error) return null;

  return (
    <MainCard
      title={payment ? <PaymentHeader payment={payment} /> : ""}
      actions={
        <CustomerActions
          onAction={handleCustomerAction}
          availableActions={availableActions}
        />
      }
    >
      {loading && (
        <Box>
          {" "}
          <CircularProgress />
        </Box>
      )}
      {!loading && <PaymentDetails payment={payment!} />}
    </MainCard>
  );
};

interface PaymentProps {
  payment: PaymentFullResponse;
}

const PaymentHeader: FC<PaymentProps> = ({ payment }) => {
  const { token } = usePoolContract(payment.poolId);

  return (
    <Grid container spacing={gridSpacing} direction="row" alignItems="center">
      <Grid item>
        <Typography variant="h3">{`Payment for ${payment.tokenQuantity} ${token.name}`}</Typography>
      </Grid>
      <Grid item>
        <PaymentStatusChip
          status={payment.status.toLowerCase() as PaymentStatus}
        />
        {/*<VerificationChip level={verificationLevel} />*/}
        {/*{isActive ? (*/}
        {/*  <Chip sx={{ ml: 1 }} label="Active" color="success" />*/}
        {/*) : (*/}
        {/*  <Chip sx={{ ml: 1 }} label="Deactivated" color="warning" />*/}
        {/*)}*/}
        {/*{isBlocked && <Chip sx={{ ml: 1 }} label="Blocked" color="error" />}*/}
        {/*{payment.customer.blockchainAccounts.length ? (*/}
        {/*  <ExternalLink*/}
        {/*    href={getAccountLink(*/}
        {/*      payment.customer.blockchainAccounts[0].accountId*/}
        {/*    )}*/}
        {/*  >*/}
        {/*    <Chip*/}
        {/*      sx={{ ml: 1 }}*/}
        {/*      label={payment.customer.blockchainAccounts[0].rsAddress}*/}
        {/*      color="info"*/}
        {/*      clickable*/}
        {/*    />*/}
        {/*  </ExternalLink>*/}
        {/*) : (*/}
        {/*  <Chip sx={{ ml: 1 }} label="No Blockchain Account" color="error" />*/}
        {/*)}*/}
      </Grid>
      <Grid item>
        <Typography variant="h4">Actions here</Typography>
      </Grid>
    </Grid>
  );
};

const PaymentDetails: FC<PaymentProps> = ({ payment }) => {
  const { getAccountLink, getTransactionLink } = useExplorerLink();
  const { showError, showSuccess } = useSnackbar();
  const { Ledger } = useAppContext();
  const { token } = usePoolContract(payment.poolId);
  const { customer } = payment;
  const blockchainAccount =
    customer.blockchainAccounts.length && customer.blockchainAccounts[0];

  const amountUsd = parseFloat(payment.usd);
  const amountCurrency = parseFloat(payment.amount);
  const exchangeRate = amountUsd > 0 ? amountCurrency / amountUsd : 0;

  let url = "";
  if (payment.type === "usdeth") {
    url =
      (Ledger.IsTestnet
        ? `https://goerli.etherscan.io/tx/`
        : `https://etherscan.io/tx/`) + payment.id;
  }

  const handleCopy = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      showSuccess("Transaction Id copied to clipboard");
    } catch (e) {
      showError("Copying to clipboard failed");
    }
  };

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <Grid item xs={12} md={6}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            <LabeledTextField
              label="Paid at"
              text={new Date(payment.createdAt).toLocaleDateString()}
            />
            <LabeledTextField
              label="Last updated"
              text={new Date(payment.updatedAt).toLocaleDateString()}
            />
            <LabeledTextField label="Pool Token" text={token.name} />
            <LabeledTextField label="Paid Amount">
              <Typography variant="h5">
                <Number
                  value={payment.amount}
                  decimals={2}
                  suffix={payment.currency}
                />
              </Typography>
            </LabeledTextField>
            <LabeledTextField label="Paid Amount in USD">
              <Typography variant="h5">
                <Number value={payment.usd} decimals={2} suffix={"USD"} />
              </Typography>
            </LabeledTextField>
            <LabeledTextField label="Exchange Rate">
              <Typography variant="h5">
                1 USD :{" "}
                <Number
                  value={exchangeRate}
                  decimals={2}
                  suffix={payment.currency}
                />
              </Typography>
            </LabeledTextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LabeledTextField
              label="Payment Method"
              text={payment.type.toUpperCase()}
            />
            <LabeledTextField label="Transaction Id">
              {url ? (
                <ExternalLink href={url}>
                  <>{shortenHash(payment.transactionId)}</>
                </ExternalLink>
              ) : (
                <Box
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onClick={() => handleCopy(payment.transactionId)}
                >
                  {shortenHash(payment.transactionId)}
                  <IconCopy />
                </Box>
              )}
            </LabeledTextField>
            <LabeledTextField label="Permanent Record Id">
              <ExternalLink href={getTransactionLink(payment.recordId)}>
                <>{shortenHash(payment.recordId)}</>
              </ExternalLink>
            </LabeledTextField>
            <LabeledTextField label="Permanent Processed Id">
              {payment.processedRecordId ? (
                <ExternalLink
                  href={getTransactionLink(payment.processedRecordId)}
                >
                  <>{shortenHash(payment.processedRecordId)}</>
                </ExternalLink>
              ) : (
                "Not processed yet"
              )}
            </LabeledTextField>
            <LabeledTextField label="Permanent Cancellation Id">
              {payment.cancelRecordId ? (
                <ExternalLink href={getTransactionLink(payment.cancelRecordId)}>
                  <>{shortenHash(payment.cancelRecordId)}</>
                </ExternalLink>
              ) : (
                "Not cancelled"
              )}
            </LabeledTextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LabeledTextField label="Customer">
              <Grid container columnSpacing={1} direction="row">
                <Grid item>
                  {payment.customer.firstName}&nbsp;{payment.customer.lastName}
                </Grid>
              </Grid>
            </LabeledTextField>
            <LabeledTextField label="CPF">
              <Grid container columnSpacing={1} direction="row">
                <Grid item>{cpf.format(payment.customer.cpfCnpj)}</Grid>
              </Grid>
            </LabeledTextField>
            <LabeledTextField label="Signum Account">
              <Grid container columnSpacing={1} direction="row">
                <Grid item>
                  {blockchainAccount ? (
                    <ExternalLink
                      href={getAccountLink(blockchainAccount.accountId)}
                    >
                      {blockchainAccount.rsAddress}
                    </ExternalLink>
                  ) : (
                    "No Signum Account?"
                  )}
                </Grid>
              </Grid>
            </LabeledTextField>
            <LabeledTextField
              label="Verification Level"
              text={payment.customer.verificationLevel}
            />
            <LabeledTextField label="Status">
              <Grid container columnSpacing={1} direction="row">
                <Grid item>
                  {customer.isActive ? (
                    <Chip sx={{ ml: 1 }} label="Active" color="success" />
                  ) : (
                    <Chip sx={{ ml: 1 }} label="Deactivated" color="warning" />
                  )}
                  {customer.isBlocked && (
                    <Chip sx={{ ml: 1 }} label="Blocked" color="error" />
                  )}
                </Grid>
              </Grid>
            </LabeledTextField>
          </Grid>
        </Grid>
        <Divider />
        <Grid item xs={12} md={12} lg={12}>
          <LabeledTextField label="Observations">
            <Typography variant="caption">
              {payment.observations || "No Observations"}
            </Typography>
          </LabeledTextField>
        </Grid>
      </Grid>
    </Grid>
  );
};
