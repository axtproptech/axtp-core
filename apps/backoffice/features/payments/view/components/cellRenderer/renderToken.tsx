import { usePoolContract } from "@/app/hooks/usePoolContract";
import { Number } from "@/app/components/number";
import { GridRenderCellParams } from "@mui/x-data-grid";

const TokenCell = ({ poolId, amount }: { poolId: string; amount: string }) => {
  const contract = usePoolContract(poolId);
  const handleOnCLick = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!contract) return null;
  return (
    <a
      href={`/admin/pools/${poolId}`}
      style={{
        cursor: "pointer",
        textDecoration: "underline",
        color: "var(--primary-color)",
      }}
      onClick={handleOnCLick}
    >
      <Number
        value={amount}
        decimals={contract.token.decimals}
        suffix={contract.token.name}
        style={{ cursor: "pointer" }}
      />
    </a>
  );
};

export const renderToken = (params: GridRenderCellParams<string>) => {
  return params.value ? (
    <TokenCell poolId={params.row.poolId} amount={params.value} />
  ) : null;
};
