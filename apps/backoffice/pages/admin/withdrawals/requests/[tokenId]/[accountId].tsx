import { Layout } from "@/app/components/layout";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";
import { SingleWithdrawalRequest } from "@/features/withdrawals/singleRequest";

export default function WithdrawalRequestPage() {
  const { query } = useRouter();
  const tokenId = singleQueryArg(query.tokenId);
  const accountId = singleQueryArg(query.accountId);
  if (!(tokenId && accountId)) return null;

  return (
    <Layout>
      <SingleWithdrawalRequest accountId={accountId} tokenId={tokenId} />
    </Layout>
  );
}
