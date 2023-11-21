import { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";
import { cpf } from "cpf-cnpj-validator";
import { customerService } from "@/app/services/customerService/customerService";
import { Divider, Grid, Tooltip, Typography } from "@mui/material";
import { EditableField } from "@/features/customers/view/components/editableField";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { ExternalLink } from "@/app/components/links/externalLink";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { toDateStr } from "@/app/toDateStr";
import AddressEditor from "@/features/customers/view/components/addressEditor";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { CustomerDocuments } from "@/features/customers/view/components/customerDocuments";
import { Config } from "@/app/config";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";

const gridSpacing = Config.Layout.GridSpacing;

interface Props {
  customer: CustomerFullResponse;
}

export const CustomerDetails: FC<Props> = ({ customer }) => {
  const { query } = useRouter();
  const { showError } = useSnackbar();
  const { mutate } = useSWRConfig();
  const address = customer.addresses.length && customer.addresses[0];
  const cuid = query.cuid as string;
  const account =
    customer.blockchainAccounts.length && customer.blockchainAccounts[0];

  const cpfValid = useMemo(() => {
    return cpf.isValid(customer.cpfCnpj);
  }, [customer.cpfCnpj]);

  const handleFieldValueChange = async (_: string, updatedData: any) => {
    try {
      await customerService.with(cuid).updateCustomer(updatedData);
      await mutate(`getCustomer/${cuid}`);
    } catch (e: any) {
      console.error("Updating customer failed!", e);
      showError("Updating customer failed!");
    }
  };

  return (
    <Grid container spacing={gridSpacing} direction="column">
      <Grid item xs={12} md={6}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            <EditableField
              label="CPF"
              initialValue={cpf.format(customer.cpfCnpj)}
              name="cpfCnpj"
              onSubmit={handleFieldValueChange}
            />
            <Grid
              container
              columnSpacing={1}
              direction="row"
              alignItems="center"
            >
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
                <ExternalLink href="https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp">
                  Validate CPF
                </ExternalLink>
              </Grid>
            </Grid>
            <EditableField
              label="Phone Number"
              initialValue={customer.phone1}
              name="phone1"
              onSubmit={handleFieldValueChange}
            />
            <LabeledTextField label="Email" text={customer.email1} />

            <EditableField
              label="Date of Birth"
              initialValue={new Date(customer.dateOfBirth)}
              name="dateOfBirth"
              onSubmit={handleFieldValueChange}
            />
            <EditableField
              label="Place of Birth"
              initialValue={customer.placeOfBirth}
              name="placeOfBirth"
              onSubmit={handleFieldValueChange}
            />
            <LabeledTextField label="Nationality" text={customer.nationality} />
            <LabeledTextField
              label="Brazilian Resident"
              text={customer.isInBrazil ? "YES" : "NO"}
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
              text={toDateStr(new Date(customer.createdAt))}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            {address ? (
              <>
                <LabeledTextField label="Street" text={address.line1} />

                <LabeledTextField label="Complement" text={address.line2} />

                <LabeledTextField label="Annotation" text={address.line3} />

                <LabeledTextField label="ZipCode" text={address.postCodeZip} />

                <LabeledTextField label="City" text={address.city} />
                <LabeledTextField label="State" text={address.state} />

                <LabeledTextField label="Country" text={address.country} />
              </>
            ) : (
              <Typography variant="h4">No address provided</Typography>
            )}
            <AddressEditor address={address} />
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
              <>
                <Typography variant="h4">No Blockchain Account yet</Typography>
                <Typography variant="subtitle2">
                  (Or wallet not connected)
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid item xs={12} md={6} lg={4}>
        <CustomerDocuments customer={customer} />
      </Grid>
    </Grid>
  );
};
