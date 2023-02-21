import { Layout } from "@/app/components/layout";
import { AllPaymentsOverview } from "@/features/payments/view/allPaymentsOverview";

export default function paymentsPage() {
  return (
    <Layout>
      <AllPaymentsOverview />
    </Layout>
  );
}
