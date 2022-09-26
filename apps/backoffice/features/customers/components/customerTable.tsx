import { MainCard } from "@/app/components/cards";
import useSWR from "swr";
import { customerService } from "@/app/services/customerService/customerService";
import { useMemo } from "react";
import { Table } from "@/app/components/table/table";

const headers = [
  "First Name",
  "Last Name",
  "CPF",
  "Email",
  "Phone",
  "Applied On",
];
const Days = 1000 * 60 * 60 * 24;

export const CustomerTable = () => {
  const { data, error } = useSWR("getPendingTokenHolders", () => {
    return customerService.fetchPendingCustomers();
  });

  const tableData = useMemo(() => {
    if (!data) {
      return {
        headers,
        rows: [] as object[],
      };
    }
    return {
      headers,
      rows: data.map(
        ({ firstName, lastName, cpfCnpj, email1, phone1, createdAt }) => {
          const createdAtDate = new Date(createdAt);
          const overdue = Date.now() - createdAtDate.getTime() > 10 * Days;
          const applied = new Date(createdAt).toLocaleDateString();

          let style = {};
          if (overdue) {
            style = { color: "red", fontWeight: 700 };
          }
          return {
            firstName,
            lastName,
            cpfCnpj,
            email1,
            phone1,
            applied: <div style={style}>{applied}</div>,
          };
        }
      ),
    };
  }, [data]);

  return (
    <MainCard title="Pending Token Holders">
      <Table data={tableData} />
    </MainCard>
  );
};
