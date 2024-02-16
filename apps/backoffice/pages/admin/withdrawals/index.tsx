import { Layout } from "@/app/components/layout";
import { WithdrawalsDashboard } from "@/features/withdrawals/dashboard";

export default function homePage() {
  return (
    <Layout>
      <WithdrawalsDashboard />
    </Layout>
  );
}
