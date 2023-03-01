import { useAppContext } from "@/app/hooks/useAppContext";
import { ExternalLink } from "@/app/components/links/externalLink";
import { shortenHash } from "@/app/shortenHash";
import { GridRenderCellParams } from "@mui/x-data-grid";

const RecordLink = ({ txId }: { txId: string }) => {
  const { Ledger } = useAppContext();

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ExternalLink href={`${Ledger.ExploreBaseUrl}/tx/${txId}`}>
        {shortenHash(txId)}
      </ExternalLink>
    </div>
  );
};

export const renderPaymentRecordId = (params: GridRenderCellParams<string>) => {
  return params.value ? <RecordLink txId={params.value} /> : null;
};
