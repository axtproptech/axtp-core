import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridEvents,
  GridEventsStr,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { useRouter } from "next/router";
import { VerificationChip } from "@/app/components/chips/verificationChip";
import { ActivationChip } from "@/app/components/chips/activationChip";
import { BlockingChip } from "@/app/components/chips/blockingChip";

const Days = 1000 * 60 * 60 * 24;

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
          cpfCnpj,
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

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/customers/${e.id}`);
  };

  return (
    <MainCard title="Token Holders">
      <div style={{ height: "70vh" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid
            rows={tableRows}
            columns={columns}
            loading={loading}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </MainCard>
  );
};
