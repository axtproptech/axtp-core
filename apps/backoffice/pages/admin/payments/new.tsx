import { Layout } from "@/app/components/layout";
import { RegisterPayment } from "@/features/payments/register";

export default function paymentsPage() {
  return (
    <Layout>
      <RegisterPayment />
    </Layout>
  );
}
