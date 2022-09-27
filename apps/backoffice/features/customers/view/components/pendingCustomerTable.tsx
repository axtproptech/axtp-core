import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { useMemo } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const Days = 1000 * 60 * 60 * 24;

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;

  const createdAtDate = new Date(createdAt);
  const overdue = Date.now() - createdAtDate.getTime() > 10 * Days;
  const applied = new Date(createdAt).toLocaleDateString();

  let style = {};
  if (overdue) {
    style = { color: "red", fontWeight: 700 };
  }

  return <div style={style}>{applied}</div>;
};
const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Applied On", renderCell: renderCreatedAt },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "cpfCnpj", headerName: "CPF", flex: 1 },
  { field: "email1", headerName: "E-Mail", flex: 1 },
  { field: "phone1", headerName: "Phone", flex: 1 },
];

export const PendingCustomerTable = () => {
  const { data, error } = useSWR("getPendingTokenHolders", () => {
    return customerService.fetchPendingCustomers();
  });

  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.map(
      ({ id, firstName, lastName, cpfCnpj, email1, phone1, createdAt }) => {
        return {
          id,
          firstName,
          lastName,
          cpfCnpj,
          email1,
          phone1,
          createdAt,
        };
      }
    );
  }, [data]);

  const loading = !data && !error;

  return (
    <MainCard title="Pending Token Holders">
      <div style={{ height: "400px" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <DataGrid rows={tableRows} columns={columns} loading={loading} />
        </div>
      </div>
    </MainCard>
  );
};
