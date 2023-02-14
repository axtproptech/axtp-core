import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
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
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { ExternalLink } from "@/app/components/links/externalLink";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { useExplorerLink } from "@/app/hooks/useExplorerLink";
import { DownloadButton } from "@/app/components/buttons/downloadButton";
import { cpf } from "cpf-cnpj-validator";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { useRouter } from "next/router";
const gridSpacing = Config.Layout.GridSpacing;

export const SingleCustomer = () => {
  const { query } = useRouter();
  const cuid = query.cuid as string;
  const { getAccountLink } = useExplorerLink();
  const { mutate } = useSWRConfig();
  const { data: customer, error } = useSWR(`getCustomer/${cuid}`, () => {
    return customerService.with(cuid).fetchCustomer();
  });

  const verifyCustomer = async () => {
    try {
      await customerService.with(cuid).verifyCustomer("Level1");
      await Promise.all([
        mutate(`getCustomer/${cuid}`),
        mutate("getPendingTokenHolders"),
      ]);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const activateCustomer = async (isActive: boolean) => {
    try {
      await customerService.with(cuid).setCustomerActivationState(isActive);
      await mutate(`getCustomer/${cuid}`);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const blockCustomer = async (isBlocked: boolean) => {
    try {
      await customerService.with(cuid).setCustomerBlockingState(isBlocked);
      await mutate(`getCustomer/${cuid}`);
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
    if (!customer) return actions;

    if (
      customer.verificationLevel === "Pending" ||
      customer.verificationLevel === "NotVerified"
    ) {
      actions.add("verify");
    }
    actions.add(customer.isActive ? "deactivate" : "activate");
    actions.add(customer.isBlocked ? "unblock" : "block");
    return actions;
  }, [customer]);

  const loading = !customer && !error;

  // TODO: handle error

  const title = useMemo(() => {
    if (loading || !customer) return "Loading...";

    const { blockchainAccounts, isActive, isBlocked, verificationLevel } =
      customer;
    return (
      <Grid container spacing={gridSpacing} direction="row" alignItems="center">
        <Grid item>
          <Typography variant="h4">
            {`${customer?.firstName} ${customer?.lastName}`}
          </Typography>
        </Grid>
        <Grid item>
          <VerificationChip level={verificationLevel} />
          {isActive ? (
            <Chip sx={{ ml: 1 }} label="Active" color="success" />
          ) : (
            <Chip sx={{ ml: 1 }} label="Deactivated" color="warning" />
          )}
          {isBlocked && <Chip sx={{ ml: 1 }} label="Blocked" color="error" />}
          {blockchainAccounts.length ? (
            <ExternalLink
              href={getAccountLink(blockchainAccounts[0].accountId)}
            >
              <Chip
                sx={{ ml: 1 }}
                label={blockchainAccounts[0].rsAddress}
                color="info"
                clickable
              />
            </ExternalLink>
          ) : (
            <Chip sx={{ ml: 1 }} label="No Blockchain Account" color="error" />
          )}
        </Grid>
      </Grid>
    );
  }, [customer, loading]);

  return (
    <MainCard
      title={title}
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
      {!loading && <CustomerDetails customer={customer!} />}
    </MainCard>
  );
};

interface DetailsProps {
  customer: CustomerFullResponse;
}

const CustomerDetails: FC<DetailsProps> = ({ customer }) => {
  const address = customer.addresses.length && customer.addresses[0];
  const account = customer.addresses.length && customer.blockchainAccounts[0];
  const documents = customer.documents;

  const cpfValid = useMemo(() => {
    return cpf.isValid(customer.cpfCnpj);
  }, [customer.cpfCnpj]);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <Grid item xs={12} md={6}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            <LabeledTextField label="CPF">
              <Grid container columnSpacing={1} direction="row">
                <Grid item>{cpf.format(customer.cpfCnpj)}</Grid>
                <Grid item>
                  {cpfValid ? (
                    <Tooltip title="Valid Format">
                      <CheckIcon color="success" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Format Incorrect">
                      <ErrorIcon color="error" />
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <ExternalLink
                    href={
                      "https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp"
                    }
                  >
                    Validate CPF
                  </ExternalLink>
                </Grid>
              </Grid>
            </LabeledTextField>
            <LabeledTextField label="Phone Number" text={customer.phone1} />
            <LabeledTextField label="Email" text={customer.email1} />
            <LabeledTextField
              label="Date and Place of Birth"
              text={`${new Date(customer.dateOfBirth).toLocaleDateString()}, ${
                customer.placeOfBirth
              }`}
            />
            <LabeledTextField
              label="Nationality"
              text={`${customer.nationality}`}
            />
            <LabeledTextField
              label="Mother's Name"
              text={`${customer.firstNameMother} ${customer.lastNameMother}`}
            />
            <LabeledTextField
              label="Verification Level"
              text={customer.verificationLevel}
            />
            <LabeledTextField
              label="Applied on"
              text={new Date(customer.createdAt).toLocaleDateString()}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {address ? (
              <>
                <LabeledTextField label="Street" text={address.line1} />
                <LabeledTextField label="Complement" text={address.line2} />
                <LabeledTextField
                  label="Annotation"
                  text={`${address.line3} ${address.line4}`}
                />
                <LabeledTextField
                  label="ZipCode"
                  text={`${address.postCodeZip}`}
                />
                <LabeledTextField
                  label="City, State"
                  text={`${address.city}, ${address.state}`}
                />
                <LabeledTextField label="Country" text={`${address.country}`} />
              </>
            ) : (
              <Typography variant="h4">No address provided</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {account ? (
              <>
                <LabeledTextField
                  label="Account Address"
                  text={account.rsAddress}
                />
                <LabeledTextField label="Account Id" text={account.accountId} />
                <LabeledTextField
                  label="Public Key"
                  text={account.publicKey.toUpperCase()}
                />
                <OpenExplorerButton id={account.accountId} type="address" />
              </>
            ) : (
              <Typography variant="h4">No Blockchain Account yet</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid item xs={12} md={6} lg={4}>
        <Typography variant="h4">Documents</Typography>
        <Grid container spacing={gridSpacing} direction="row">
          {documents.map((d, index) => {
            return (
              <Grid item xs={12} lg={3} sx={{ my: 2 }} key={index}>
                <LabeledTextField label="Type" text={d.type} />
                <LabeledTextField
                  label="Upload Date"
                  text={new Date(d.createdAt).toLocaleDateString()}
                />
                <DownloadButton url={d.url} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
