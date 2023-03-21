import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Config } from "@/app/config";
import { FC, useMemo, useState } from "react";
import useSWR from "swr";
import { MainCard } from "@/app/components/cards";
import { PaymentActions, PaymentActionType } from "./components/paymentActions";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { ExternalLink } from "@/app/components/links/externalLink";
import { useExplorerLink } from "@/app/hooks/useExplorerLink";
import { cpf } from "cpf-cnpj-validator";
import { useRouter } from "next/router";
import { paymentsService } from "@/app/services/paymentService/paymentService";
import { PaymentFullResponse } from "@/bff/types/paymentFullResponse";
import { PaymentStatusChip } from "./components/cellRenderer/renderPaymentStatus";
import { PaymentStatus } from "@/types/paymentStatus";
import { usePoolContract } from "@/app/hooks/usePoolContract";
import { Number } from "@/app/components/number";
import { useAppContext } from "@/app/hooks/useAppContext";
import { shortenHash } from "@/app/shortenHash";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { IconCopy } from "@tabler/icons";
import {
  CancellationArgs,
  CancelPaymentDialog,
} from "@/features/payments/view/components/cancelPaymentDialog";
import {
  RegisterTransactionIdDialog,
  RegistrationArgs,
} from "./components/registerTransactionIdDialog";
import { toDateStr } from "@/app/toDateStr";

const gridSpacing = Config.Layout.GridSpacing;

export const SinglePayment = () => {
  const router = useRouter();
  const { showError, showSuccess } = useSnackbar();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const paymentId = parseInt(router.query.id as string);
  const {
    data: payment,
    error,
    mutate,
  } = useSWR(paymentId ? `getPayment/${paymentId}` : null, () => {
    return paymentsService.with(paymentId).fetchPayment();
  });

  const sendToken = async () => {
    try {
      if (!payment) return;

      const params = new URLSearchParams({
        action: "send-token",
        recipient: payment.customer.blockchainAccounts[0].publicKey,
        quantity: payment.tokenQuantity.toString(10),
        payment: payment.id.toString(10),
      });
      await router.push(`/admin/pools/${payment.poolId}?${params.toString()}`);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const confirmCancelPayment = async (args: CancellationArgs) => {
    try {
      if (!payment) {
        throw new Error("No payment available");
      }
      await paymentsService
        .with(payment.id)
        .setCancelled(args.transactionId, args.reason);
      mutate().then(); // revalidate async'ly
      showSuccess("Successfully cancelled payment");
      setCancelModalOpen(false);
    } catch (e: any) {
      console.error("confirmCancelPayment", e.message);
      showError("Failure while cancelling the payment");
    }
  };
  const confirmRegisterTransactionId = async (args: RegistrationArgs) => {
    try {
      if (!payment) {
        throw new Error("No payment available");
      }

      await paymentsService
        .with(payment.id)
        .updateTransactionId(args.transactionId);
      mutate().then(); // revalidate async'ly
      showSuccess("Successfully updated payment");
      setRegisterModalOpen(false);
    } catch (e: any) {
      console.error("confirmRegisterPayment", e.message);
      showError("Failure while updating the payment");
    }
  };

  const handleCustomerAction = async (action: PaymentActionType) => {
    switch (action) {
      case "send-token":
        return sendToken();
      case "register-transaction-id":
        return setRegisterModalOpen(true);
      case "cancel-payment":
        return setCancelModalOpen(true);
      default:
        return new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 2000);
        });
    }
  };
  const availableActions = useMemo(() => {
    const actions = new Set<PaymentActionType>();
    if (!payment) return actions;
    const { customer } = payment;

    const isCustomerEligible =
      customer.verificationLevel.startsWith("Level") &&
      customer.isActive &&
      !customer.isBlocked &&
      customer.blockchainAccounts.length;

    if (
      isCustomerEligible &&
      payment.transactionId &&
      !payment.processedRecordId &&
      !payment.cancelRecordId
    ) {
      actions.add("send-token");
    }

    if (
      isCustomerEligible &&
      !payment.transactionId &&
      !payment.processedRecordId &&
      !payment.cancelRecordId
    ) {
      actions.add("register-transaction-id");
    }

    if (!payment.processedRecordId && !payment.cancelRecordId) {
      actions.add("cancel-payment");
    }
    return actions;
  }, [payment]);

  const loading = !payment && !error;

  // TODO: handle error

  if (error) return null;

  return (
    <>
      {payment && (
        <>
          <CancelPaymentDialog
            open={cancelModalOpen}
            payment={payment}
            onClose={confirmCancelPayment}
            onCancel={() => setCancelModalOpen(false)}
          />
          <RegisterTransactionIdDialog
            open={registerModalOpen}
            onClose={confirmRegisterTransactionId}
            onCancel={() => setRegisterModalOpen(false)}
          />
        </>
      )}
      <MainCard
        title={payment ? <PaymentHeader payment={payment} /> : ""}
        actions={
          <PaymentActions
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
    </>
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
      </Grid>
    </Grid>
  );
};

const getEthereumTransactionLink = (isTestnet: boolean, txId: string) =>
  (isTestnet ? `https://goerli.etherscan.io/tx/` : `https://etherscan.io/tx/`) +
  txId;

const getPolygonTransactionLink = (isTestnet: boolean, txId: string) =>
  (isTestnet
    ? `https://mumbai.polygonscan.com/tx/`
    : `https://polygonscan.com/tx/`) + txId;

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

  let transactionUrl = "";
  let cancelTransactionUrl = "";
  // TODO: refoctor
  if (payment.type === "usdeth") {
    transactionUrl = getEthereumTransactionLink(
      Ledger.IsTestnet,
      payment.transactionId
    );
    cancelTransactionUrl = payment.cancelTransactionId
      ? getEthereumTransactionLink(
          Ledger.IsTestnet,
          payment.cancelTransactionId
        )
      : "";
  } else if (payment.type === "usdmat") {
    transactionUrl = getPolygonTransactionLink(
      Ledger.IsTestnet,
      payment.transactionId
    );
    cancelTransactionUrl = payment.cancelTransactionId
      ? getPolygonTransactionLink(Ledger.IsTestnet, payment.cancelTransactionId)
      : "";
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
              text={toDateStr(new Date(payment.createdAt))}
            />
            <LabeledTextField
              label="Last updated"
              text={toDateStr(new Date(payment.updatedAt))}
            />
            <LabeledTextField label="Pool Token" text={token.name} />
            <LabeledTextField label="Token Quantity">
              <Typography variant="h5">
                <Number
                  value={payment.tokenQuantity}
                  decimals={token.decimals}
                />
              </Typography>
            </LabeledTextField>
            <LabeledTextField label="Paid Amount">
              <Typography variant="h5">
                <Number
                  value={payment.amount}
                  decimals={2}
                  suffix={payment.currency.toUpperCase()}
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
                  suffix={payment.currency.toUpperCase()}
                />
              </Typography>
            </LabeledTextField>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <LabeledTextField
              label="Payment Method"
              text={payment.type.toUpperCase()}
            />
            {payment.transactionId ? (
              <LabeledTextField label="Transaction Id">
                {transactionUrl ? (
                  <ExternalLink href={transactionUrl}>
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
            ) : (
              <LabeledTextField label="Transaction Id">
                <Chip label="Not Registered" color="error" />
              </LabeledTextField>
            )}
            <LabeledTextField label="Permanent Record Id">
              {payment.recordId ? (
                <ExternalLink href={getTransactionLink(payment.recordId)}>
                  <>{shortenHash(payment.recordId)}</>
                </ExternalLink>
              ) : (
                "Not registered yet"
              )}
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
            {payment.cancelTransactionId && (
              <LabeledTextField label="Cancel Transaction Id">
                {cancelTransactionUrl && (
                  <ExternalLink href={cancelTransactionUrl}>
                    <>{shortenHash(payment.cancelTransactionId)}</>
                  </ExternalLink>
                )}
                {!cancelTransactionUrl && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onClick={() =>
                      handleCopy(payment.cancelTransactionId || "")
                    }
                  >
                    {shortenHash(payment.cancelTransactionId)}
                    <IconCopy />
                  </Box>
                )}
              </LabeledTextField>
            )}
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
