import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { useMemo } from "react";
import {
  DataGrid,
  GridAlignment,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { cpf } from "cpf-cnpj-validator";
import { toDateStr } from "@/app/toDateStr";

const Days = 1000 * 60 * 60 * 24;

const renderCreatedAt = (params: GridRenderCellParams<string>) => {
  const createdAt = params.value;
  if (!createdAt) return null;

  const createdAtDate = new Date(createdAt);
  const overdue = Date.now() - createdAtDate.getTime() > 10 * Days;
  const applied = toDateStr(new Date(createdAt));

  let style = {};
  if (overdue) {
    style = { color: "red", fontWeight: 700 };
  }

  return <div style={style}>{applied}</div>;
};

const FlagCellProps = {
  flex: 0,
  resizable: false,
  width: 80,
  align: "center" as GridAlignment,
};

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "Applied On", renderCell: renderCreatedAt },
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "cpfCnpj", headerName: "CPF", flex: 1 },
  { field: "email1", headerName: "E-Mail", flex: 1 },
  { field: "phone1", headerName: "Phone", flex: 1 },
  { field: "isInvited", headerName: "Invited", ...FlagCellProps },
  { field: "isInBrazil", headerName: "Brazilian", ...FlagCellProps },
];

const asFlag = (b: Boolean) => (b ? "✅" : "❌");

export const PendingCustomerTable = () => {
  const router = useRouter();

  const { data, error } = useSWR("getPendingTokenHolders", () => {
    return customerService.fetchPendingCustomers();
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
        isInBrazil,
        isInvited,
      }) => {
        return {
          id: cuid,
          firstName,
          lastName,
          cpfCnpj: cpf.format(cpfCnpj),
          email1,
          phone1,
          isInBrazil: asFlag(isInBrazil),
          isInvited: asFlag(isInvited),
          createdAt,
        };
      }
    );
  }, [data]);

  const loading = !data && !error;

  const handleRowClick = async (e: GridRowParams) => {
    await router.push(`/admin/customers/${e.id}`);
  };

  return (
    <MainCard title="Pending Token Holders">
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
