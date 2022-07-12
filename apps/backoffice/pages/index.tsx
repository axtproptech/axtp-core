import { Layout } from "@/app/components/Layout";
import { Dashboard } from "@/features/dashboard";

export default function homePage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
