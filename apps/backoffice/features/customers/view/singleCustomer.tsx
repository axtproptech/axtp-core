import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { Config } from "@/app/config";
import { FC, useMemo, useState } from "react";
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
import { cpf } from "cpf-cnpj-validator";
import { OpenExplorerButton } from "@/app/components/buttons/openExplorerButton";
import { useRouter } from "next/router";
import { toDateStr } from "@/app/toDateStr";
import { auth0Service } from "@/app/services/auth0Service";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {
  DesktopDatePicker as DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isValid } from "date-fns";
import AddressEditor from "./components/addressEditor";
import { CustomerDocuments } from "@/features/customers/view/components/customerDocuments";

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

  // TODO: handle error
  interface EditableNameProps {
    initialFirstName: string;
    initialLastName: string;
    nationalityIcon: string;
    onSave: (name: { firstName: string; lastName: string }) => void;
  }

  const EditableName = ({
    initialFirstName,
    initialLastName,
    nationalityIcon,
    onSave,
  }: EditableNameProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);

    const handleSave = () => {
      setIsEditing(false);
      onSave({ firstName, lastName });
    };

    const handleCancelClick = () => {
      setIsEditing(false);
    };

    return (
      <Grid container spacing={1} direction="row" alignItems="center">
        {isEditing ? (
          <>
            <Grid item>
              <TextField
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                label="First Name"
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                label="Last Name"
                size="small"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Tooltip title="Save">
                <IconButton size="small" onClick={handleSave}>
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="cancel">
                <IconButton onClick={handleCancelClick}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </>
        ) : (
          <>
            <Grid item>
              <Typography variant="h4">
                {`${firstName} ${lastName} ${nationalityIcon}`}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Edit Name">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </>
        )}
      </Grid>
    );
  };

  const title = useMemo(() => {
    if (loading || !customer) return "Loading...";

    const { blockchainAccounts, isActive, isBlocked, verificationLevel } =
      customer;
    return (
      <Grid container spacing={gridSpacing} direction="row" alignItems="center">
        <Grid item>
          <EditableName
            initialFirstName={customer?.firstName}
            initialLastName={customer?.lastName}
            nationalityIcon={customer.isInBrazil ? "🇧🇷" : "🌐"}
            onSave={async (newNames) => {
              await customerService.with(cuid).updateCustomer({
                firstName: newNames.firstName,
                lastName: newNames.lastName,
              });
            }}
          />
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

interface EditableFieldProps {
  label: string;
  initialValue: string;
  name: string;
  type?: string;
  onSubmit: (name: string, value: string) => void;
}

const EditableField = ({
  label,
  initialValue,
  name,
  onSubmit,
  type,
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<String | Date | null>(initialValue);
  const { register, handleSubmit, control } = useForm();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const onFieldSubmit = (data: any) => {
    onSubmit(name, data);
    setIsEditing(false);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {isEditing ? (
        <form
          style={{ padding: "16px 0" }}
          onSubmit={handleSubmit(onFieldSubmit)}
        >
          {type === "date" ? (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Controller
                name={name}
                control={control}
                defaultValue={initialValue}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                      isValid(date) && setValue(format(date, `dd/MM/yyyy`));
                    }}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={label}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton type="submit">
                                <CheckIcon />
                              </IconButton>
                              <IconButton onClick={handleCancelClick}>
                                <CloseIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                      />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          ) : (
            <TextField
              {...register(name)}
              defaultValue={value}
              label={label}
              fullWidth
              onChange={(e) => setValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit">
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        </form>
      ) : (
        <>
          <Grid item xs>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography>
                {label}:{" "}
                {value instanceof Date ? format(value, `dd/MM/yyyy`) : value}
              </Typography>
              <IconButton
                style={{ marginLeft: "1rem" }}
                onClick={handleEditClick}
              >
                <EditIcon />
              </IconButton>
            </div>
          </Grid>
        </>
      )}
    </Grid>
  );
};

const CustomerDetails: FC<DetailsProps> = ({ customer }) => {
  const { query } = useRouter();
  const address = customer.addresses.length && customer.addresses[0];
  const cuid = query.cuid as string;
  const account =
    customer.blockchainAccounts.length && customer.blockchainAccounts[0];
  const documents = customer.documents;

  const cpfValid = useMemo(() => {
    return cpf.isValid(customer.cpfCnpj);
  }, [customer.cpfCnpj]);

  const handleFieldValueChange = async (_: string, updatedData: any) => {
    await customerService.with(cuid).updateCustomer(updatedData);
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
              initialValue={toDateStr(new Date(customer.dateOfBirth))}
              name="dateOfBirth"
              onSubmit={handleFieldValueChange}
              type="date"
            />
            <EditableField
              label="Place of Birth"
              initialValue={customer.placeOfBirth}
              name="placeOfBirth"
              onSubmit={handleFieldValueChange}
            />
            <LabeledTextField
              label="Nationality"
              text={`${customer.nationality}`}
            />
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
