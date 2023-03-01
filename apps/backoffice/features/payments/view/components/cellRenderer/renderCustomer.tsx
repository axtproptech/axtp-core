import { useRouter } from "next/router";
import { Button, Tooltip } from "@mui/material";
import { IconLink } from "@tabler/icons";
import { GridRenderCellParams } from "@mui/x-data-grid";

const CustomerLink = ({ cuid }: { cuid: string }) => {
  const router = useRouter();
  const handleOnCLick = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    await router.push(`/admin/customers/${cuid}`);
  };

  return (
    <Button onClick={handleOnCLick}>
      <Tooltip title={"View Customer"}>
        <IconLink />
      </Tooltip>
    </Button>
  );
};
export const renderCustomer = (params: GridRenderCellParams<string>) => {
  return params.value ? <CustomerLink cuid={params.value} /> : null;
};
