import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Config } from "@/app/config";
import { FC, useMemo } from "react";
import { customerService } from "@/app/services/customerService/customerService";
import useSWR from "swr";
import { MainCard } from "@/app/components/cards";
import {
  CustomerActions,
  CustomerActionType,
} from "./components/customerActions";
import { CustomerResponse } from "@/bff/types/customerResponse";
import { ChildrenProps } from "@/types/childrenProps";
import { DetailSection } from "@/app/components/sections/detailSection";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  cuid: string;
}

export const SingleCustomer: FC<Props> = ({ cuid }) => {
  const { data: customer, error } = useSWR(`getCustomer/${cuid}`, () => {
    return customerService.fetchCustomer(cuid);
  });

  const handleCustomerAction = async (action: CustomerActionType) => {
    // TODO:
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
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
  const name = loading
    ? "Loading..."
    : `${customer?.firstName} ${customer?.lastName}`;

  // TODO: handle error

  return (
    <MainCard
      title={name}
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
  const address = customer.addresses[0];

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} md={6}>
        <LabeledTextField label="CPF" text={customer.cpfCnpj} />
        <LabeledTextField label="Phone Number" text={customer.phone1} />
        <LabeledTextField label="Email" text={customer.email1} />
        <LabeledTextField
          label="Date of Birth"
          text={new Date(customer.dateOfBirth).toLocaleDateString()}
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
      {address && (
        <Grid item xs={12} md={6}>
          <LabeledTextField label="Street" text={address.line1} />
          <LabeledTextField label="Complement" text={address.line2} />
          <LabeledTextField
            label="Annotation"
            text={`${address.line3} ${address.line4}`}
          />
          <LabeledTextField label="ZipCode" text={`${address.postCodeZip}`} />
          <LabeledTextField
            label="City, State"
            text={`${address.city}, ${address.state}`}
          />
          <LabeledTextField label="Country" text={`${address.country}`} />
        </Grid>
      )}
      {!address && (
        <Grid item xs={12} md={6}>
          <Typography variant="h4">No address provided</Typography>
        </Grid>
      )}
    </Grid>
  );
};
