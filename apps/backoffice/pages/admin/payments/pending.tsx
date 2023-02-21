import { Layout } from "@/app/components/layout";
import { PendingPaymentsOverview } from "@/features/payments/view/pendingPaymentsOverview";

export default function pendingPaymentsPage() {
  return (
    <Layout>
      <PendingPaymentsOverview />
    </Layout>
  );
}
