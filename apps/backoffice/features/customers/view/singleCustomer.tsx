import { Box, Chip, CircularProgress, Grid } from "@mui/material";
import { Config } from "@/app/config";
import { useMemo } from "react";
import { customerService } from "@/app/services/customerService/customerService";
import useSWR, { useSWRConfig } from "swr";
import { MainCard } from "@/app/components/cards";
import {
  CustomerActions,
  CustomerActionType,
} from "./components/customerActions";
import { ExternalLink } from "@/app/components/links/externalLink";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { useExplorerLink } from "@/app/hooks/useExplorerLink";
import { useRouter } from "next/router";
import { auth0Service } from "@/app/services/auth0Service";
import { EditableName } from "./components/nameEditor";
import { CustomerDetails } from "./components/customerDetails";

const gridSpacing = Config.Layout.GridSpacing;
export const SingleCustomer = () => {
  const { query } = useRouter();
  const cuid = query.cuid as string;
  const { getAccountLink } = useExplorerLink();
  const { mutate } = useSWRConfig();
  const { data: customer, error } = useSWR(`getCustomer/${cuid}`, () => {
    return customerService.with(cuid).fetchCustomer();
  });

  const inviteCustomerExclusiveArea = async () => {
    try {
      await auth0Service.createUser(cuid);
      await customerService.with(cuid).setCustomerInvitationState(true);
      await Promise.all([
        mutate(`getCustomer/${cuid}`),
        mutate("getPendingTokenHolders"),
      ]);
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const verifyCustomer = async () => {
    try {
      await customerService.with(cuid).verifyCustomer("Level1");
      await auth0Service.createUser(cuid);
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
      if (customer?.isInvited) {
        await auth0Service.setUserBlocked(cuid, isBlocked);
      }
    } catch (e) {
      console.error("Some error", e);
    }
  };

  const handleCustomerAction = async (action: CustomerActionType) => {
    switch (action) {
      case "verify":
        return verifyCustomer();
      case "invite":
        return inviteCustomerExclusiveArea();
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
    if (!customer.isInvited) {
      actions.add("invite");
    }
    actions.add(customer.isActive ? "deactivate" : "activate");
    actions.add(customer.isBlocked ? "unblock" : "block");

    return actions;
  }, [customer]);

  const loading = !customer && !error;

  const title = useMemo(() => {
    if (loading || !customer) return "Loading...";

    const { blockchainAccounts, isActive, isBlocked, verificationLevel } =
      customer;
    return (
      <Grid container spacing={gridSpacing} direction="row" alignItems="center">
        <Grid item>
          <EditableName customer={customer} />
        </Grid>
        <Grid item>
          <VerificationChip level={verificationLevel} />
          {customer.isInvited && (
            <Chip sx={{ ml: 1 }} label="Invited" color="info" />
          )}
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
      actionsOnTop={true}
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
