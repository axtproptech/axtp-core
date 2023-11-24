import { FC, useMemo } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "@/app/hooks/useSnackbar";
import { useSWRConfig } from "swr";
import { cpf } from "cpf-cnpj-validator";
import { customerService } from "@/app/services/customerService/customerService";
import { CustomerFullResponse } from "@/bff/types/customerFullResponse";
import { Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { ExternalLink } from "@/app/components/links/externalLink";
import { LabeledTextField } from "@/app/components/labeledTextField";
import { toDateStr } from "@/app/toDateStr";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { EditableField } from "./editableField";
import { CustomerDocuments } from "./customerDocuments";
import { Config } from "@/app/config";
import { EditableFirstNameLastName, Name } from "./editableFirstNameLastName";

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

  const handleFieldValueChange = async (name: string, updatedData: any) => {
    try {
      await customerService.with(cuid).updateCustomer({ [name]: updatedData });
    } catch (e: any) {
      console.error("Updating customer failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${cuid}`);
    }
  };

  const handleAddressValueChange = async (name: string, updatedData: any) => {
    try {
      const addressId = customer.addresses.length
        ? customer.addresses[0].id
        : -1;
      await customerService.with(cuid).updateCustomerAddress({
        addressId,
        [name]: updatedData,
      });
    } catch (e: any) {
      console.error("Updating customer address failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${cuid}`);
    }
  };

  const handleMotherNameChange = async ({ firstName, lastName }: Name) => {
    try {
      await customerService
        .with(cuid)
        .updateCustomer({
          firstNameMother: firstName,
          lastNameMother: lastName,
        });
      await mutate(`getCustomer/${cuid}`);
    } catch (e: any) {
      console.error("Updating customer failed!", e);
      showError("Updating customer failed!");
    } finally {
      await mutate(`getCustomer/${cuid}`);
    }
  };

  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* ACCOUNT SECTION */}
      <Grid
        item
        xs={12}
        m={2}
        sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
      >
        <Typography variant="h4">Blockchain Account</Typography>
        {account ? (
          <>
            <Stack
              direction="row"
              spacing={1}
              justifyContent="start"
              alignItems="center"
            >
              <div>
                <LabeledTextField
                  label="Account Address"
                  text={account.rsAddress}
                />
              </div>
              <OpenExplorerButton id={account.accountId} type="address" />
            </Stack>
            <LabeledTextField label="Account Id" text={account.accountId} />
            <LabeledTextField
              label="Public Key"
              text={account.publicKey.toUpperCase()}
            />
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

      <Grid item xs={12} m={2}>
        <Grid container spacing={gridSpacing}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
            pr={2}
          >
            <Typography variant="h4">Personal Information</Typography>
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
                <ExternalLink
                  href={`https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp?cpf=${customer.cpfCnpj}`}
                >
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
            {/*TODO: email must be integrated into Brevo also! - backend!*/}
            <EditableField
              label="Email"
              initialValue={customer.email1}
              name="email1"
              onSubmit={handleFieldValueChange}
            />

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
            <EditableField
              label="Nationality"
              initialValue={customer.nationality}
              name="nationality"
              onSubmit={handleFieldValueChange}
            />
            {/*TODO: handle yes/no */}
            <LabeledTextField
              label="Brazilian Resident"
              text={customer.isInBrazil ? "YES" : "NO"}
            />
            <EditableFirstNameLastName
              label="Mother's Name"
              name={{
                firstName: customer.firstNameMother,
                lastName: customer.lastNameMother,
              }}
              onSubmit={handleMotherNameChange}
            />
            <LabeledTextField
              label="Verification Level"
              text={customer.verificationLevel}
            />
            <Stack direction="row">
              <LabeledTextField
                label="Applied on"
                text={toDateStr(new Date(customer.createdAt))}
              />
              <LabeledTextField
                label="Last Updated"
                text={toDateStr(new Date(customer.updatedAt))}
              />
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ border: "1px solid lightgrey", borderRadius: 2 }}
            pr={2}
          >
            <Typography variant="h4">Address</Typography>

            {address ? (
              <>
                <EditableField
                  label="Street"
                  initialValue={address.line1}
                  name="line1"
                  onSubmit={handleAddressValueChange}
                />
                <EditableField
                  label="Complement"
                  initialValue={address.line2}
                  name="line2"
                  onSubmit={handleAddressValueChange}
                />
                <EditableField
                  label="Zip Code"
                  initialValue={address.postCodeZip}
                  name="postCodeZip"
                  onSubmit={handleAddressValueChange}
                />
                <EditableField
                  label="City"
                  initialValue={address.city}
                  name="city"
                  onSubmit={handleAddressValueChange}
                />
                <EditableField
                  label="State"
                  initialValue={address.state}
                  name="state"
                  onSubmit={handleAddressValueChange}
                />
                <EditableField
                  label="Country"
                  initialValue={address.country}
                  name="country"
                  onSubmit={handleAddressValueChange}
                />

                <EditableField
                  label="Annotation"
                  initialValue={address.line2}
                  name="line3"
                  onSubmit={handleAddressValueChange}
                />
              </>
            ) : (
              <Typography variant="h4">No address provided</Typography>
            )}
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
