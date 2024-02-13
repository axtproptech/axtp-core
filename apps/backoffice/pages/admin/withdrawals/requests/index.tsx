import { Layout } from "@/app/components/layout";
import { WithdrawalRequests } from "@/features/withdrawals/requests";

export default function withdrawalRequestsPage() {
  return (
    <Layout>
      <WithdrawalRequests />
    </Layout>
  );
}
