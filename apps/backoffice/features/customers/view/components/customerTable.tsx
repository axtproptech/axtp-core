import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { ChangeEvent, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { ActivationChip } from "@/app/components/chips/activationChip";
import { BlockingChip } from "@/app/components/chips/blockingChip";
import { TextInput } from "@/app/components/inputs";
import { cpf } from "cpf-cnpj-validator";

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;
  const applied = new Date(createdAt).toLocaleDateString();
  return <div>{applied}</div>;
};

const renderVerificationLevel = (params: GridRenderCellParams<string>) => {
  const verification = params.value;
  if (!verification) return null;
  return <VerificationChip level={verification} />;
};

const renderActive = (params: GridRenderCellParams<boolean>) => {
  return <ActivationChip isActive={Boolean(params.value)} />;
};

const renderBlocked = (params: GridRenderCellParams<boolean>) => {
  return <BlockingChip isBlocked={Boolean(params.value)} alwaysShow />;
};

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Applied On", renderCell: renderCreatedAt },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "cpfCnpj", headerName: "CPF", flex: 1 },
  { field: "email1", headerName: "E-Mail", flex: 1 },
  { field: "phone1", headerName: "Phone", flex: 1 },
  {
    field: "verificationLevel",
    headerName: "Verification",
    flex: 1,
    renderCell: renderVerificationLevel,
  },
  {
    field: "isActive",
    headerName: "Active",
    flex: 1,
    renderCell: renderActive,
  },
  {
    field: "isBlocked",
    headerName: "Blocked",
    flex: 1,
    renderCell: renderBlocked,
  },
];

export const CustomerTable = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const { data, error } = useSWR("getAllTokenHolders", () => {
    return customerService.fetchCustomers({ verified: true });
  });

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map(
      ({
        cuid,
        firstName,
        lastName,
        cpfCnpj,
        email1,
        phone1,
        createdAt,
        verificationLevel,
        isBlocked,
        isActive,
      }) => {
        return {
          id: cuid,
          firstName,
          lastName,
          cpfCnpj: cpf.format(cpfCnpj),
          email1,
          phone1,
          createdAt,
          verificationLevel,
          isBlocked,
          isActive,
        };
      }
    );
  }, [data]);

  const filteredRows = useMemo(() => {
    if (!searchValue) return tableRows;

    const isLike = (a: string, b: string) => a.toLowerCase().indexOf(b) !== -1;

    return tableRows.filter(({ email1, cpfCnpj, firstName, lastName }) => {
      return (
        isLike(email1, searchValue) ||
        isLike(cpfCnpj, searchValue) ||
        isLike(firstName, searchValue) ||
        isLike(lastName, searchValue)
      );
    });
  }, [tableRows, searchValue]);

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/customers/${e.id}`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <MainCard title="Token Holders">
      <Grid container>
        <Grid item md={4}>
          <TextInput
            label="Search"
            onChange={handleSearch}
            value={searchValue}
          />
        </Grid>
      </Grid>
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </MainCard>
  );
};
