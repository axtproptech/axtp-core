import { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";
import { cpf } from "cpf-cnpj-validator";
import { customerService } from "@/app/services/customerService/customerService";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { Grid, Stack, Tooltip, Typography } from "@mui/material";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { ExternalLink } from "@/app/components/links/externalLink";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { toDateStr } from "@/app/toDateStr";
import { EditableField } from "../editableField";
import { CustomerDocuments } from "../customerDocuments";
import { Config } from "@/app/config";
import { BlockchainAccountSection } from "./blockchainAccountSection";
import { PersonalInformationSection } from "@/features/customers/view/components/customerDetails/personalInformationSection";
import { AddressSection } from "@/features/customers/view/components/customerDetails/addressSection";
import { BankingInfoSection } from "@/features/customers/view/components/customerDetails/bankingInfoSection";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  customer: CustomerFullResponse;
}

export const CustomerDetails: FC<Props> = ({ customer }) => {
  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* ACCOUNT SECTION */}
      <Grid
        item
        xs={12}
        m={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <BlockchainAccountSection customer={customer} />
      </Grid>

      <Grid item xs={12} m={2}>
        <Grid container spacing={gridSpacing}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
            pr={2}
            mr={2}
          >
            <PersonalInformationSection customer={customer} />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
            pr={2}
            mr={2}
          >
            <AddressSection customer={customer} />
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
            pr={2}
            mr={2}
          >
            <BankingInfoSection customer={customer} />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        mx={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <CustomerDocuments customer={customer} />
      </Grid>
    </Grid>
  );
};
