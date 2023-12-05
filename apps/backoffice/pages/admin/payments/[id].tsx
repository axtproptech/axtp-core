import { Layout } from "@/app/components/layout";
import { SinglePayment } from "@/features/payments/view/singlePayment";
import { useRouter } from "next/router";
import { singleQueryArg } from "@/app/singleQueryArg";
export default function PaymentsPage() {
  const { query } = useRouter();
  const paymentId = parseInt(singleQueryArg(query.id));
  if (!paymentId || !Number.isInteger(paymentId)) return null;
  return (
    <Layout>
      <SinglePayment paymentId={paymentId} />
    </Layout>
  );
}
