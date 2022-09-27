import { Layout } from "@/app/components/layout";
import { AllCustomersOverview } from "@/features/customers/view/allCustomersOverview";

export default function customersPage() {
  return (
    <Layout>
      <AllCustomersOverview />
    </Layout>
  );
}
