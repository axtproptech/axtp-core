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

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  cuid: string;
}

export const SingleCustomer: FC<Props> = ({ cuid }) => {
  const { data, error } = useSWR(`getCustomer/${cuid}`, () => {
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
    if (!data) return actions;

    if (
      data.verificationLevel === "Pending" ||
      data.verificationLevel === "NotVerified"
    ) {
      actions.add("verify");
    }
    actions.add(data.isActive ? "deactivate" : "activate");
    actions.add(data.isBlocked ? "unblock" : "block");
    return actions;
  }, [data]);

  const loading = !data && !error;
  const name = `${data?.firstName} ${data?.lastName}`;

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
      <Box>{loading ? <CircularProgress /> : <h2>To Do</h2>}</Box>
    </MainCard>
  );
};
