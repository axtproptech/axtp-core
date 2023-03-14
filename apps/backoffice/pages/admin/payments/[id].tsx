import { Layout } from "@/app/components/layout";
import { SinglePayment } from "@/features/payments/view/singlePayment";
export default function paymentsPage() {
  return (
    <Layout>
      <SinglePayment />
    </Layout>
  );
}
