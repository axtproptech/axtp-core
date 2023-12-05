import { Layout } from "@/app/components/layout";
import { PendingCustomersOverview } from "@/features/customers/view/pendingCustomers";

export default function PendingCustomersPage() {
  return (
    <Layout>
      <PendingCustomersOverview />
    </Layout>
  );
}
