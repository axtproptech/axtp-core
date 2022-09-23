import { Layout } from "@/app/components/layout";
import { CustomersOverview } from "@/features/customers";

export default function customersPage() {
  return (
    <Layout>
      <CustomersOverview />
    </Layout>
  );
}
